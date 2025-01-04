// src/modelos/lojas/loja.module.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LojaController } from './controller/lojaController';
import { LojaService } from './service/lojaService';
import { LojaRepository } from './repo/lojaRepo';
import { LojaSchema } from './schema/lojaSchema';
import { ModuloAplicacao } from '../../utils/logger/logger'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Loja', schema: LojaSchema }]),
    ModuloAplicacao
  ],
  controllers: [LojaController],
  providers: [LojaService, LojaRepository],
  exports: [LojaService, LojaRepository], 
})
export class LojaModule {}
