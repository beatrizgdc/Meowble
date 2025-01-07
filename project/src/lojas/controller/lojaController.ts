import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    Param,
    BadRequestException,
} from '@nestjs/common';
import { CreateLojaDto } from '../dtos/lojaDto';
import { LojaService } from '../service/lojaService';
import { LojaDocument } from '../schema/lojaSchema';
import { IsValidState } from '../../validators/estadoValidator';
import { ValidationArguments } from 'class-validator';
import { IsValidCep } from '../../validators/cepValidator';

@Controller('lojas')
export class LojaController {
    constructor(
        private readonly lojaService: LojaService,
        private readonly IsValidState: IsValidState,
        private readonly IsValidCep: IsValidCep
    ) {}

    @Post()
    async create(@Body() createLojaDto: CreateLojaDto): Promise<LojaDocument> {
        return this.lojaService.create(createLojaDto);
    }

    @Get()
    async listAll() {
        const resultado = await this.lojaService.findAll();
        return {
            stores: resultado.stores,
            total: resultado.total,
            mensagem: resultado.mensagem || '',
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const resultado = await this.lojaService.findById(id);
        return {
            stores: resultado.stores,
            total: resultado.total,
            mensagem: resultado.mensagem || '',
        };
    }

    @Get('uf/:uf')
    async findByUf(
        @Param('uf') uf: string,
        @Query('limit') limit: number = 1,
        @Query('offset') offset: number = 0
    ) {
        if (!this.IsValidState.validate(uf, {} as ValidationArguments)) {
            throw new BadRequestException('O estado informado é inválido.');
        }

        const resultado = await this.lojaService.findByUf(uf, limit, offset);
        return {
            stores: resultado.stores,
            limit: resultado.limit,
            offset: resultado.offset,
            total: resultado.total,
            mensagem: resultado.mensagem || '',
        };
    }

    @Get('/buscarProx/:cep')
    async findByCep(
        @Param('cep') cep: string,
        @Query('limit') limit: number = 1,
        @Query('offset') offset: number = 0
    ) {
        if (!(await this.IsValidCep.validate(cep, {} as ValidationArguments))) {
            throw new BadRequestException('O CEP informado é inválido.');
        }
        const result = await this.lojaService.findByCep(cep, limit, offset);
        return result;
    }
}
