import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LojaController } from './controller/lojaController';
import { LojaService } from './service/lojaService';
import { LojaRepository } from './repo/lojaRepo';
import { LojaSchema } from './schema/lojaSchema';
import { ModuloAplicacao } from '../../utils/logger/logger';
import { IsValidCep } from '../../validators/cepValidator';
import { HttpModule } from '@nestjs/axios';
import { IsValidCountry } from '../../validators/paisValidator';
import { IsValidState } from '../../validators/estadoValidator';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Loja', schema: LojaSchema }]),
        ModuloAplicacao,
        HttpModule,
    ],
    controllers: [LojaController],
    providers: [
        LojaService,
        LojaRepository,
        IsValidCep,
        IsValidCountry,
        IsValidState,
    ],
    exports: [LojaService, LojaRepository],
})
export class LojaModule {}
