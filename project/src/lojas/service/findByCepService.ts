import { getDistance } from 'geolib';
import { Error } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LojaDocument } from '../schema/lojaSchema';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { LojaRepository } from '../repo/lojaRepo';
import { HereMapsService } from '../../hereMaps/buscarLatLong/service/hereMapsService';

interface LojaRetorno {
    stores: {
        menor50Km: LojaComDistancia[];
        maiorIgual50Km: LojaComDistancia[];
    };
    lojaTipo: string;
    limit: number;
    offset: number;
    total: number;
    mensagem?: string;
}

interface LojaComDistancia extends LojaDocument {
    distanciaKm: number | null;
}

@Injectable()
export class findByCepServiceService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger,
        private readonly hereMapsService: HereMapsService
    ) {}

    async findByCep(
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

            // listar tds as lojas
            const lojasData = await this.lojaRepository.findAll(limit, offset);
            const totalLojas = await this.lojaRepository.count();

            // Calc dist CEP/lojas
            const lojasComDistancia: LojaComDistancia[] = lojasData.map(
                (loja: LojaDocument): LojaComDistancia => {
                    const lojaLatitude = parseFloat(loja.latitude);
                    const lojaLongitude = parseFloat(loja.longitude);

                    if (isNaN(lojaLatitude) || isNaN(lojaLongitude)) {
                        this.logger.error(
                            `Coordenadas inválidas para a loja ${loja.lojaNome}: Latitude ${loja.latitude}, Longitude ${loja.longitude}`,
                            Error
                        );
                        return {
                            ...loja.toObject(), // transforma em objeto plain
                            distanciaKm: null,
                        };
                    }

                    this.logger.log(
                        `Calculando distância para a loja ${loja.lojaNome}: Coordenadas da loja: [${lojaLatitude}, ${lojaLongitude}], Coordenadas do CEP: [${coordenadas.latitude}, ${coordenadas.longitude}]`
                    );

                    // Calc dist
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

                    return {
                        ...loja.toObject(), // transforma em objeto plain
                        distanciaKm: distanceInMeters / 1000, // Converte para km
                    };
                }
            );

            const lojasMenor50Km = lojasComDistancia.filter(
                (loja) => loja.distanciaKm !== null && loja.distanciaKm < 50
            );

            const lojasMaiorIgual50Km = lojasComDistancia.filter(
                (loja) => loja.distanciaKm !== null && loja.distanciaKm >= 50
            );

            const tiposDeLojas = lojasMenor50Km.reduce<{
                [key: string]: LojaComDistancia[];
            }>(
                (acc, loja) => {
                    const lojaTipo = loja.lojaTipo.valueOf(); //converte p/ str primitiva

                    if (lojaTipo === 'PDV') {
                        if (!acc['pdvs']) acc['pdvs'] = [];
                        acc['pdvs'].push(loja);
                    } else if (lojaTipo === 'LOJA') {
                        if (!acc['lojas']) acc['lojas'] = [];
                        acc['lojas'].push(loja);
                    } else {
                        this.logger.warn(
                            `Tipo de loja desconhecido: ${loja.lojaTipo}`
                        );
                    }
                    return acc;
                },
                { pdvs: [], lojas: [] }
            );

            tiposDeLojas.pdvs.forEach((loja) => console.log('Tipo PDV:', loja));
            tiposDeLojas.lojas.forEach((loja) =>
                console.log('Tipo LOJA:', loja)
            );

            lojasMenor50Km.sort((a, b) => a.distanciaKm! - b.distanciaKm!);
            lojasMaiorIgual50Km.sort((a, b) => a.distanciaKm! - b.distanciaKm!);

            return {
                stores: {
                    menor50Km: lojasMenor50Km,
                    maiorIgual50Km: lojasMaiorIgual50Km,
                },
                lojaTipo: tiposDeLojas.lojas.length > 0 ? 'LOJA' : 'PDV', // Ajuste a lógica conforme necessário
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
