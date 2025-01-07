import { Injectable } from '@nestjs/common';
import { LojaDocument } from '../schema/lojaSchema';
import { CreateLojaDto } from '../dtos/lojaDto';
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
export class LojaService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger,
        private readonly HereMapsService: HereMapsService
    ) {}

    // Criar a loja
    async create(createLojaDto: CreateLojaDto): Promise<LojaDocument> {
        this.logger.log('Recebendo dados para criação da loja 👩‍💻👩‍💻👩‍💻👩‍💻');
        try {
            const resultado = await this.lojaRepository.create(createLojaDto);
            this.logger.log('Loja criada com sucesso 😸😸');
            return resultado;
        } catch (error) {
            this.logger.error('Erro ao salvar a nova loja: 😿😿', error);
            throw error;
        }
    }

    // Listar todas
    async findAll(limit: number = 1, offset: number = 0): Promise<LojaRetorno> {
        try {
            const lojas = await this.lojaRepository.findAll(limit, offset);
            const total = await this.lojaRepository.count();
            if (lojas.length === 0) {
                this.logger.warn('Nenhuma loja encontrada 😔');
                return {
                    stores: [],
                    limit,
                    offset,
                    total,
                    mensagem: `Nenhuma loja encontrada 😔`,
                };
            }
            const lojasFiltradas = lojas.map((loja: LojaDocument) => {
                const { tempoDePreparo, disponivelNoEstoque, ...resto } =
                    loja.toObject();
                return resto;
            });
            this.logger.log('Lojas listadas com sucesso 😸😸');
            return { stores: lojasFiltradas, limit, offset, total };
        } catch (error) {
            this.logger.error('Erro ao listar as lojas: 😿😿', error);
            throw error;
        }
    }

    // Listar por ID
    async findById(id: string): Promise<LojaRetorno> {
        try {
            const loja = await this.lojaRepository.findById(id);
            if (!loja) {
                this.logger.warn(`Loja com ID ${id} não encontrada 😔`);
                return {
                    stores: [],
                    limit: 1,
                    offset: 0,
                    total: 0,
                    mensagem: `A loja com ID ${id} não foi encontrada 😔`,
                };
            }
            const {
                _id,
                latitude,
                longitude,
                tempoDePreparo,
                disponivelNoEstoque,
                ...resto
            } = loja.toObject();
            this.logger.log(`Loja com ID ${id} encontrada com sucesso 😸😸`);
            return {
                stores: [resto],
                limit: 1,
                offset: 0,
                total: 1,
            };
        } catch (error) {
            this.logger.error(
                `Erro ao buscar a loja com ID ${id}: 😿😿`,
                error
            );
            throw error;
        }
    }

    // Listar por UF
    async findByUf(
        uf: string,
        limit: number = 1,
        offset: number = 0
    ): Promise<LojaRetorno> {
        try {
            const lojas = await this.lojaRepository.findByUf(uf, limit, offset);
            const total = await this.lojaRepository.countByUf(uf);
            if (lojas.length === 0) {
                this.logger.warn(`Nenhuma loja encontrada na UF ${uf} 😔`);
                return {
                    stores: [],
                    limit,
                    offset,
                    total,
                    mensagem: `Nenhuma loja encontrada na UF ${uf} 😔`,
                };
            }
            const lojasFiltradas = lojas.map((loja: LojaDocument) => {
                const {
                    latitude,
                    longitude,
                    tempoDePreparo,
                    disponivelNoEstoque,
                    ...resto
                } = loja.toObject();
                return resto;
            });
            this.logger.log(`Lojas na UF ${uf} listadas com sucesso 😸😸`);
            return { stores: lojasFiltradas, limit, offset, total };
        } catch (error) {
            this.logger.error(
                `Erro ao listar as lojas na UF ${uf}: 😿😿`,
                error
            );
            throw error;
        }
    }

    //Buscar por CEP
    async buscarLojaPorCep(
        cep: string,
        limit: number = 1,
        offset: number = 0
    ): Promise<any> {
        try {
            // Coordenadas do CEP pela HereMap
            const coordenadas = await this.HereMapsService.getCoordinates(cep);
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
            const lojasData = await this.findAll(limit, offset);
            const totalLojas = await this.lojaRepository.count();

            // Calculando a distância entre o CEP e as lojas
            const lojasComDistancia = lojasData.stores.map(
                (loja: LojaDocument) => {
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
                        `Calculando distância para a loja ${loja.lojaNome}:
                        Coordenadas da loja: [${lojaLatitude}, ${lojaLongitude}],
                        Coordenadas do CEP: [${coordenadas.latitude}, ${coordenadas.longitude}]`
                    );

                    // Calculando a distância
                    const distanceInMeters = getDistance(
                        {
                            latitude: coordenadas.latitude,
                            longitude: coordenadas.longitude,
                        },
                        { latitude: lojaLatitude, longitude: lojaLongitude }
                    );
                    this.logger.log(
                        `Distância calculada para a loja ${loja.lojaNome} (metros): ${distanceInMeters}`
                    );

                    // Modificando o tipo da loja com base na distância
                    const tipoLoja =
                        distanceInMeters / 1000 < 50 ? 'PDV' : 'Loja';

                    return {
                        ...loja,
                        distanciaKm: distanceInMeters / 1000, // Converte para km
                        lojaTipo: tipoLoja, // Atualiza o tipo da loja
                    };
                }
            );

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
