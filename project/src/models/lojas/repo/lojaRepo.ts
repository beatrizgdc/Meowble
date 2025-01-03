import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loja, LojaDocument } from '../modelo/lojaSchema';
import { CreateLojaDto } from '../dtos/lojaDto';

@Injectable()
export class LojaRepository {
  constructor(@InjectModel('Loja') private readonly lojaModel: Model<LojaDocument>) {}

  async create(createLojaDto: CreateLojaDto): Promise<Loja> {
    const novaLoja = new this.lojaModel(createLojaDto);
    return novaLoja.save();
  }

  async findAll(): Promise<Loja[]> {
    return this.lojaModel.find().exec();
  }

  async findById(id: string): Promise<Loja> {
    return this.lojaModel.findById(id).exec();
  }

  async update(id: string, createLojaDto: CreateLojaDto): Promise<Loja> {
    return this.lojaModel.findByIdAndUpdate(id, createLojaDto, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.lojaModel.findByIdAndRemove(id).exec();
  }
}
