import { Injectable } from '@nestjs/common';
import { Loja } from '../modelo/lojaSchema';
import { LojaRepository } from '../repo/lojaRepo';
import { CreateLojaDto } from '../dtos/lojaDto';

@Injectable()
export class LojaService {
  constructor(private readonly lojaRepository: LojaRepository) {}

  async create(createLojaDto: CreateLojaDto): Promise<Loja> {
    return this.lojaRepository.create(createLojaDto);
  }

  async findAll(): Promise<Loja[]> {
    return this.lojaRepository.findAll();
  }

  async findById(id: string): Promise<Loja> {
    return this.lojaRepository.findById(id);
  }

  async update(id: string, createLojaDto: CreateLojaDto): Promise<Loja> {
    return this.lojaRepository.update(id, createLojaDto);
  }

  async delete(id: string): Promise<any> {
    return this.lojaRepository.delete(id);
  }
}
