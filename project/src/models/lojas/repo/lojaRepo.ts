import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LojaDocument } from '../schema/lojaSchema';
import { Loja } from '../interface/lojaInterface';
import { CreateLojaDto } from '../dtos/lojaDto';

@Injectable()
export class LojaRepository {
    constructor(
        @InjectModel('Loja') private readonly lojaModel: Model<LojaDocument>
    ) {}

    // Criar loja
    async create(createLojaDto: CreateLojaDto): Promise<LojaDocument> {
        const novaLoja = new this.lojaModel(createLojaDto);
        return novaLoja.save();
    }

    // Listar tudo com paginação
    async findAll(limit: number, offset: number): Promise<LojaDocument[]> {
        return this.lojaModel.find().skip(offset).limit(limit).exec();
    }

    // Contar todas as lojas
    async count(): Promise<number> {
        return this.lojaModel.countDocuments().exec();
    }

    // Listar por ID
    async findById(id: string): Promise<LojaDocument | null> {
        return this.lojaModel.findById(id).exec();
    }

    // Listar por UF
    async findByUf(
        uf: string,
        limit: number,
        offset: number
    ): Promise<LojaDocument[]> {
        return this.lojaModel.find({ uf }).skip(offset).limit(limit).exec();
    }

    // Contar documentos por UF
    async countByUf(uf: string): Promise<number> {
        return this.lojaModel.countDocuments({ uf }).exec();
    }
}
