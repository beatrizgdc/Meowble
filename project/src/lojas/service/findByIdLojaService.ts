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
export class FindByIdService {
    constructor(
        private readonly lojaRepository: LojaRepository,
        private readonly logger: ServicoDeLogger
    ) {}

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
}
