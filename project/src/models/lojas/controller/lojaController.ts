import { ServicoDeLogger } from '../../../utils/logger/logger';
import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { CreateLojaDto } from '../dtos/lojaDto';
import { Loja } from '../interface/lojaInterface';
import { LojaService } from '../service/lojaService';

@Controller('lojas')
export class LojaController {
    constructor(
        private readonly lojaService: LojaService,
        private readonly logger: ServicoDeLogger
    ) {}

    @Post()
    async create(@Body() createLojaDto: CreateLojaDto): Promise<Loja> {
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

    // @Get(':id')
    // async findById(@Param('id') id: string): Promise<Loja> {
    //   return this.lojaService.findById(id);
    // }

    // @Put(':id')
    // async update(@Param('id') id: string, @Body() createLojaDto: CreateLojaDto): Promise<Loja> {
    //   return this.lojaService.update(id, createLojaDto);
    // }

    // @Delete(':id')
    // async delete(@Param('id') id: string): Promise<any> {
    //   return this.lojaService.delete(id);
    // }
}
