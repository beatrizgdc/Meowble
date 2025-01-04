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

    async findAll(): Promise<LojaDocument[]> {
        return this.lojaModel.find().exec();
    }
}
