import { Injectable } from '@nestjs/common';
import { LojaRepository } from '../../repo/lojaRepo';
import { ServicoDeLogger } from '../../../utils/logger/logger';
import { HereMapsService } from '../../../hereMaps/buscarLatLong/service/hereMapsService';
import { getCoordinates } from './getCoordinates';
import { calculateDistances } from './calculateDistances';
import { filterStores } from './filterStores';
import { categorizeStores } from './categorizeStores';
import { CorreiosService } from '../../../correios/correiosService';
import { HereMapsServiceDelivery } from '../../../hereMaps/calculoDelivery/service/hereMapsDeliveryService';
import { error } from 'console';

@Injectable()
export class findByCepServiceService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger,
        private readonly hereMapsService: HereMapsService,
        private readonly correiosService: CorreiosService,
        private readonly hereMapsServiceDelivery: HereMapsServiceDelivery
    ) {}

    async findByCep(cep: string, limit: number = 1, offset: number = 0) {
        this.logger.log(`Iniciando busca de lojas para o CEP: ${cep}`);
        try {
            // coordenadas (getCoordinates.ts)
            const coordenadas = await getCoordinates(
                this.hereMapsService,
                cep,
                this.logger
            );
            if (
                !coordenadas ||
                !coordenadas.latitude ||
                !coordenadas.longitude
            ) {
                this.logger.error(
                    'Falha ao obter coordenadas para o CEP fornecido.',
                    error
                );
                throw new Error('Falha ao obter coordenadas.');
            }
            this.logger.log(`Coordenadas obtidas`);

            // listar todas as lojas (lojaRepo.ts / uso do findAll)
            const lojasData = await this.lojaRepository.findAll(limit, offset);
            if (!lojasData) {
                this.logger.error(
                    'Nenhuma loja encontrada no banco de dados.',
                    error
                );
                throw new Error('Nenhuma loja encontrada.');
            }
            this.logger.log(`Lojas obtidas com sucesso!`);

            const totalLojas = await this.lojaRepository.count();
            this.logger.log(`Total de lojas encontradas: ${totalLojas}`);

            // Calcular distâncias (calculateDistances.ts)
            const lojasComDistancia = calculateDistances(
                lojasData,
                coordenadas,
                this.logger
            );
            if (!lojasComDistancia) {
                this.logger.error(
                    'Falha ao calcular distâncias para as lojas.',
                    error
                );
                throw new Error('Erro ao calcular distâncias.');
            }
            this.logger.log(
                `Calculo de distância das lojas realizados com sucesso!`
            );

            // Filtrar lojas por distância e calc frete e delivery (filterStores.ts)
            const { lojasMenor50Km, lojasMaiorIgual50Km } = await filterStores(
                lojasComDistancia,
                50,
                this.correiosService,
                this.logger,
                cep,
                coordenadas.latitude.toString(),
                coordenadas.longitude.toString(),
                this.hereMapsServiceDelivery
            );

            if (!lojasMenor50Km) {
                this.logger.error(
                    'Erro ao filtrar lojas por distância do CEP fornecido. (lojasMenor50Km)',
                    error
                );
            } else if (!lojasMaiorIgual50Km) {
                this.logger.error(
                    'Erro ao filtrar lojas por distância do CEP fornecido. (lojasMaiorIgual50Km)',
                    error
                );
            }
            this.logger.log(`Lojas filtradas com sucesso!`);

            // this.logger.log(
            //     `Lojas maiores ou iguais a 50km: ${JSON.stringify(
            //         lojasMaiorIgual50Km
            //     )}
            //     Lojas menores que 50km: ${JSON.stringify(lojasMenor50Km)}`
            // );

            // categorirazar pdv/loja para lojasMenor50Km (categorizeStores.ts)
            const tiposDeLojasMenor50Km = categorizeStores(
                lojasMenor50Km,
                this.logger
            );

            const response = {
                stores: {
                    menor50Km: tiposDeLojasMenor50Km,
                    maiorIgual50Km: lojasMaiorIgual50Km,
                },
                limit,
                offset,
                total: totalLojas,
            };

            return response;

            // tratamento erro
        } catch (error) {
            this.logger.error(
                `Erro ao buscar lojas por CEP: ${cep} | erro tryCacth findByCep`,
                error
            );
            return {
                mensagem: 'Erro ao buscar lojas por CEP.',
                detalhes: {
                    mensagem:
                        error instanceof Error
                            ? error.message
                            : 'Erro desconhecido.',
                    stack: error instanceof Error ? error.stack : null,
                },
            };
        }
    }
}
