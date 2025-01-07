import { Injectable } from '@nestjs/common';
import { LojaDocument } from '../schema/lojaSchema';
import { LojaRepository } from '../repo/lojaRepo';
import { ServicoDeLogger } from '../../utils/logger/logger';

interface LojaRetorno {
    stores: any[];
    limit: number;
    offset: number;
    total: number;
    mensagem?: string;
}

@Injectable()
export class FindByUfService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger
    ) {}

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
            return {
                stores: lojasFiltradas,
                limit,
                offset,
                total,
            };
        } catch (error) {
            this.logger.error(
                `Erro ao listar as lojas na UF ${uf}: 😿😿`,
                error
            );
            throw error;
        }
    }
}
