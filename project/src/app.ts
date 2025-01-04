import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/connDB';
import { ModuloAplicacao } from './utils/logger/logger';
import { LojaModule } from './models/lojas/lojaModule';

@Module({
    imports: [DatabaseModule, ModuloAplicacao, LojaModule],
})
export class AppModule {}
