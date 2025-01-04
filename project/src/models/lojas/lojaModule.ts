// src/modelos/lojas/loja.module.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LojaController } from './controller/lojaController';
import { LojaService } from './service/lojaService';
import { LojaRepository } from './repo/lojaRepo';
import { LojaSchema } from './schema/lojaSchema';
import { ModuloAplicacao } from '../../utils/logger/logger'
import { CepService } from '../../api/viaCep/cepService'; 
import { IsValidCep } from '../../validators/cepValidator'; 
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Loja', schema: LojaSchema }]),
    ModuloAplicacao,
    HttpModule
  ],
  controllers: [LojaController],
  providers: [LojaService, LojaRepository, CepService, IsValidCep],
  exports: [LojaService, LojaRepository], 
})
export class LojaModule {}
