import { Injectable } from '@nestjs/common';
import { LojaDocument } from '../schema/lojaSchema';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { LojaRepository } from '../repo/lojaRepo';
import { HereMapsService } from '../../hereMaps/hereMapsService';
import { getDistance } from 'geolib';
import { Error } from 'mongoose';

interface LojaRetorno {
    stores: any[];
    limit: number;
    offset: number;
    total: number;
    mensagem?: string;
}

@Injectable()
export class BuscarLojaPorCepService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger,
        private readonly hereMapsService: HereMapsService
    ) {}

    async buscarLojaPorCep(
        cep: string,
        limit: number = 1,
        offset: number = 0
    ): Promise<LojaRetorno> {
        try {
            // Coordenadas do CEP pela HereMap
            const coordenadas = await this.hereMapsService.getCoordinates(cep);
            if (
                !coordenadas ||
                !coordenadas.latitude ||
                !coordenadas.longitude
            ) {
                throw new Error(
                    'Não foi possível obter as coordenadas do CEP.'
                );
            }
            this.logger.log(
                `Coordenadas do CEP: Latitude ${coordenadas.latitude}, Longitude ${coordenadas.longitude}`
            );

            // Obtendo as lojas do banco de dados
            const lojasData = await this.lojaRepository.findAll(limit, offset);
            const totalLojas = await this.lojaRepository.count();

            // Calculando a distância entre o CEP e as lojas
            const lojasComDistancia = lojasData.map((loja: LojaDocument) => {
                const lojaLatitude = parseFloat(loja.latitude);
                const lojaLongitude = parseFloat(loja.longitude);
                if (isNaN(lojaLatitude) || isNaN(lojaLongitude)) {
                    this.logger.error(
                        `Coordenadas inválidas para a loja ${loja.lojaNome}: Latitude ${loja.latitude}, Longitude ${loja.longitude}`,
                        Error
                    );
                    return { ...loja, distanciaKm: null };
                }

                this.logger.log(
                    `Calculando distância para a loja ${loja.lojaNome}: Coordenadas da loja: [${lojaLatitude}, ${lojaLongitude}], Coordenadas do CEP: [${coordenadas.latitude}, ${coordenadas.longitude}]`
                );

                // Calculando a distância
                const distanceInMeters = getDistance(
                    {
                        latitude: coordenadas.latitude,
                        longitude: coordenadas.longitude,
                    },
                    {
                        latitude: lojaLatitude,
                        longitude: lojaLongitude,
                    }
                );

                this.logger.log(
                    `Distância calculada para a loja ${loja.lojaNome} (metros): ${distanceInMeters}`
                );

                // Modificando o tipo da loja com base na distância
                const tipoLoja = distanceInMeters / 1000 < 50 ? 'PDV' : 'Loja';

                return {
                    ...loja,
                    distanciaKm: distanceInMeters / 1000, // Converte para km
                    lojaTipo: tipoLoja, // Atualiza o tipo da loja
                };
            });

            const lojasValidas = lojasComDistancia.filter(
                (loja) => loja.distanciaKm !== null
            );
            lojasValidas.sort((a, b) => a.distanciaKm! - b.distanciaKm!);

            return {
                stores: lojasValidas,
                limit,
                offset,
                total: totalLojas,
            };
        } catch (error) {
            this.logger.error('Erro ao buscar lojas por CEP:', Error);
            throw new Error('Erro ao buscar lojas próximas ao CEP fornecido.');
        }
    }
}
