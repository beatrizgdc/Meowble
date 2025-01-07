import { Injectable } from '@nestjs/common';
import { LojaRepository } from '../repo/lojaRepo';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { LojaDocument } from '../schema/lojaSchema';

interface LojaRetorno {
    stores: any[];
    limit: number;
    offset: number;
    total: number;
    mensagem?: string;
}

@Injectable()
export class FindAllLojaService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger
    ) {}

    async findAll(limit: number = 1, offset: number = 0): Promise<LojaRetorno> {
        try {
            if (!this.lojaRepository) {
                throw new Error('LojaRepository não está definido');
            }

            const lojas = await this.lojaRepository.findAll(limit, offset);
            const total = await this.lojaRepository.count();

            if (lojas.length === 0) {
                this.logger.warn('Nenhuma loja encontrada 😔');
                return {
                    stores: [],
                    limit,
                    offset,
                    total,
                    mensagem: 'Nenhuma loja encontrada 😔',
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
            console.error('Erro ao tentar listar lojas:', error);
            this.logger.error('Erro ao listar as lojas: 😿😿', error);
            throw error;
        }
    }
}
