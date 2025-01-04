// src/modelos/lojas/loja.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LojaController } from './controller/lojaController';
import { LojaService } from './service/lojaService';
import { LojaRepository } from './repo/lojaRepo';
import { LojaSchema } from './modelo/lojaSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Loja', schema: LojaSchema }]),
  ],
  controllers: [LojaController],
  providers: [LojaService, LojaRepository],
  exports: [LojaService, LojaRepository], 
})
export class LojaModule {}
