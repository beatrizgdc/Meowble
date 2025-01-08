import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/connDB';
import { ModuloAplicacao } from './utils/logger/logger';
import { LojaModule } from './lojas/lojaModule';
import { ProdutoModule } from './produtos/produtoModule';

@Module({
    imports: [DatabaseModule, ModuloAplicacao, LojaModule, ProdutoModule],
})
export class AppModule {}
