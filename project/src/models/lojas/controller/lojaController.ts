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
import { IsValidState } from '../../../validators/estadoValidator';
import { ValidationArguments } from 'class-validator';

@Controller('lojas')
export class LojaController {
    constructor(
        private readonly lojaService: LojaService,
        private readonly IsValidState: IsValidState
    ) {}

    @Post()
    async create(@Body() createLojaDto: CreateLojaDto): Promise<LojaDocument> {
        return this.lojaService.create(createLojaDto);
    }

    @Get()
    async listAll(@Query('limit') limit = 1, @Query('offset') offset = 0) {
        const resultado = await this.lojaService.findAll(limit, offset);
        return {
            stores: resultado.stores,
            limit: resultado.limit,
            offset: resultado.offset,
            total: resultado.total,
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const resultado = await this.lojaService.findById(id);
        return {
            stores: resultado.stores,
            limit: resultado.limit,
            offset: resultado.offset,
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
}
