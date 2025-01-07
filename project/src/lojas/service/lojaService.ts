import { Injectable } from '@nestjs/common';
import { CreateLojaDto } from '../dtos/lojaDto';
import { CreateLojaService } from './createLojaService';
import { FindAllLojaService } from './findAllLojaService';
import { FindByIdService } from './findByIdLojaService';
import { FindByUfService } from './findByUfService';
import { findByCepServiceService } from './findByCepService';

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
        private readonly createLojaService: CreateLojaService,
        private readonly findAllService: FindAllLojaService,
        private readonly findByIdService: FindByIdService,
        private readonly findByUfService: FindByUfService,
        private readonly buscarLojaPorCepService: findByCepServiceService
    ) {}

    // Criar a loja
    async create(createLojaDto: CreateLojaDto) {
        return this.createLojaService.create(createLojaDto);
    }

    // Listar todas
    async findAll(limit: number = 1, offset: number = 0) {
        return this.findAllService.findAll(limit, offset);
    }

    // Listar por ID
    async findById(id: string) {
        return this.findByIdService.findById(id);
    }

    // Listar por UF
    async findByUf(uf: string, limit: number = 1, offset: number = 0) {
        return this.findByUfService.findByUf(uf, limit, offset);
    }

    // Buscar por CEP
    async findByCep(cep: string, limit: number = 1, offset: number = 0) {
        return this.buscarLojaPorCepService.findByCep(cep, limit, offset);
    }
}
