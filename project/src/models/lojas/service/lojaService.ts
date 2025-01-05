import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LojaDocument } from '../schema/lojaSchema';
import { CreateLojaDto } from '../dtos/lojaDto';
import { ServicoDeLogger } from '../../../utils/logger/logger';

@Injectable()
export class LojaService {
    constructor(
        @InjectModel('Loja') private readonly lojaModel: Model<LojaDocument>,
        private readonly logger: ServicoDeLogger
    ) {}

    //Criar a loja
    async create(createLojaDto: CreateLojaDto): Promise<LojaDocument> {
        this.logger.log('Recebendo dados para criação da loja 👩‍💻👩‍💻👩‍💻👩‍💻');

        try {
            const novaLoja = new this.lojaModel(createLojaDto);
            const resultado = await novaLoja.save();
            this.logger.log('Loja criada com sucesso 😸😸');
            return resultado;
        } catch (error) {
            this.logger.error('Erro ao salvar a nova loja: 😿😿', error);
            throw error;
        }
    }

    //listar todas
    async findAll(
        limit: number = 1,
        offset: number = 0
    ): Promise<{
        stores: any[];
        limit: number;
        offset: number;
        total: number;
    }> {
        try {
            const lojas = await this.lojaModel
                .find()
                .skip(offset)
                .limit(limit)
                .exec();
            const total = await this.lojaModel.countDocuments();
            if (lojas.length === 0) {
                this.logger.warn('Nenhuma loja encontrada 😔');
                return { stores: [], limit, offset, total };
            }
            const lojasFiltradas = lojas.map((loja) => {
                const {
                    latitude,
                    longitude,
                    tempoDePreparo,
                    disponivelNoEstoque,
                    ...resto
                } = loja.toObject();
                return resto;
            });
            this.logger.log('Lojas listadas com sucesso 😸😸');
            return { stores: lojasFiltradas, limit, offset, total };
        } catch (error) {
            this.logger.error('Erro ao listar as lojas: 😿😿', error);
            throw error;
        }
    }

    //Listar por ID
    async findById(id: string): Promise<{
        stores: any[];
        limit: number;
        offset: number;
        total: number;
    }> {
        try {
            const loja = await this.lojaModel.findById(id).exec();
            if (!loja) {
                this.logger.warn(`Loja com ID ${id} não encontrada 😔`);
                return { stores: [], limit: 1, offset: 0, total: 0 };
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
            return { stores: [resto], limit: 1, offset: 0, total: 1 };
        } catch (error) {
            this.logger.error(
                `Erro ao buscar a loja com ID ${id}: 😿😿`,
                error
            );
            throw error;
        }
    }
}
