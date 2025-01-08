import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    Param,
    BadRequestException,
    Res,
} from '@nestjs/common';
import { CreateLojaDto } from '../dtos/lojaDto';
import { LojaService } from '../service/lojaService';
import { LojaDocument } from '../schema/lojaSchema';
import { IsValidState } from '../../validators/estadoValidator';
import { ValidationArguments } from 'class-validator';
import { IsValidCep } from '../../validators/cepValidator';
import { Response } from 'express';

@Controller('lojas')
export class LojaController {
    constructor(
        private readonly lojaService: LojaService,
        private readonly IsValidState: IsValidState,
        private readonly IsValidCep: IsValidCep
    ) {}

    @Post()
    async create(
        @Body() createLojaDto: CreateLojaDto,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const loja = await this.lojaService.create(createLojaDto);
            return res.status(201).json(loja);
        } catch (error) {
            console.error('Erro ao criar loja:', error);
            return res.status(500).json({ mensagem: 'Erro ao criar loja' });
        }
    }

    @Get()
    async listAll(@Res() res: Response) {
        try {
            const resultado = await this.lojaService.findAll();
            return res.status(200).json({
                stores: resultado.stores,
                total: resultado.total,
                mensagem: resultado.mensagem || '',
            });
        } catch (error) {
            console.error('Erro ao listar lojas:', error);
            return res.status(500).json({ mensagem: 'Erro ao listar lojas' });
        }
    }

    @Get(':id')
    async findById(@Param('id') id: string, @Res() res: Response) {
        try {
            const resultado = await this.lojaService.findById(id);
            return res.status(200).json({
                stores: resultado.stores,
                total: resultado.total,
                mensagem: resultado.mensagem || '',
            });
        } catch (error) {
            console.error('Erro ao buscar loja por ID:', error);
            return res
                .status(500)
                .json({ mensagem: 'Erro ao buscar loja por ID' });
        }
    }

    @Get('uf/:uf')
    async findByUf(
        @Param('uf') uf: string,
        @Query('limit') limit: number = 1,
        @Query('offset') offset: number = 0,
        @Res() res: Response
    ) {
        try {
            if (!this.IsValidState.validate(uf, {} as ValidationArguments)) {
                throw new BadRequestException('O estado informado é inválido.');
            }

            const resultado = await this.lojaService.findByUf(
                uf,
                limit,
                offset
            );
            return res.status(200).json({
                stores: resultado.stores,
                limit: resultado.limit,
                offset: resultado.offset,
                total: resultado.total,
                mensagem: resultado.mensagem || '',
            });
        } catch (error) {
            console.error('Erro ao buscar lojas por UF:', error);
            return res
                .status(500)
                .json({ mensagem: 'Erro ao buscar lojas por UF' });
        }
    }

    @Get('/buscarProx/:cep')
    async findByCep(
        @Param('cep') cep: string,
        @Query('limit') limit: number = 1,
        @Query('offset') offset: number = 0,
        @Res() res: Response
    ) {
        try {
            if (
                !(await this.IsValidCep.validate(
                    cep,
                    {} as ValidationArguments
                ))
            ) {
                throw new BadRequestException('O CEP informado é inválido.');
            }
            const resultado = await this.lojaService.findByCep(
                cep,
                limit,
                offset
            );

            // Log para confirmar o JSON antes de enviar a resposta
            // console.log('JSON retornado:', resultado);
            console.log('lojas filtradas com sucesso!');
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Erro ao buscar lojas por CEP:', error);

            const errorDetails =
                error instanceof Error
                    ? { mensagem: error.message, stack: error.stack }
                    : { mensagem: 'Erro desconhecido', detalhes: error };

            return res.status(500).json({
                mensagem: 'Erro ao buscar lojas por CEP.',
                detalhes: errorDetails,
            });
        }
    }

    // @Get('/buscarProx/:cep')
    // async findByCep(
    //     @Param('cep') cep: string,
    //     @Query('limit') limit: number = 1,
    //     @Query('offset') offset: number = 0
    // ) {
    //     if (!(await this.IsValidCep.validate(cep, {} as ValidationArguments))) {
    //         throw new BadRequestException('O CEP informado é inválido.');
    //     }
    //     const result = await this.lojaService.findByCep(cep, limit, offset);
    //     return result;
    // }
}
