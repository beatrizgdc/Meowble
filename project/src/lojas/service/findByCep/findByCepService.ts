import { Injectable } from '@nestjs/common';
import { LojaRepository } from '../../repo/lojaRepo';
import { ServicoDeLogger } from '../../../utils/logger/logger';
import { HereMapsService } from '../../../hereMaps/buscarLatLong/service/hereMapsService';
import { getCoordinates } from './getCoordinates';
import { calculateDistances } from './calculateDistances';
import { filterStores } from './filterStores';
import { categorizeStores } from './categorizeStores';

@Injectable()
export class findByCepServiceService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger,
        private readonly hereMapsService: HereMapsService
    ) {}

    async findByCep(cep: string, limit: number = 1, offset: number = 0) {
        try {
            const coordenadas = await getCoordinates(
                this.hereMapsService,
                cep,
                this.logger
            );
            const lojasData = await this.lojaRepository.findAll(limit, offset);
            const totalLojas = await this.lojaRepository.count();

            const lojasComDistancia = calculateDistances(
                lojasData,
                coordenadas,
                this.logger
            );
            const { lojasMenor50Km, lojasMaiorIgual50Km } = filterStores(
                lojasComDistancia,
                50
            );
            const tiposDeLojasMenor50Km = categorizeStores(
                lojasMenor50Km,
                this.logger
            );

            return {
                stores: {
                    menor50Km: {
                        pdvs: tiposDeLojasMenor50Km['pdvs'],
                        lojas: tiposDeLojasMenor50Km['lojas'],
                    },
                    maiorIgual50Km: lojasMaiorIgual50Km,
                },
                limit,
                offset,
                total: totalLojas,
            };
        } catch (error) {
            this.logger.error('Erro ao buscar lojas por CEP:', error);
            throw new Error('Erro ao buscar lojas próximas ao CEP fornecido.');
        }
    }
}
