import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/connDB';
import { ModuloAplicacao } from './utils/logger/logger';
import { LojaModule } from './lojas/lojaModule';
import { ProdutoModule } from './produtos/produtoModule';
import { publicModule } from './public/publicModule';
@Module({
    imports: [
        DatabaseModule,
        ModuloAplicacao,
        LojaModule,
        ProdutoModule,
        publicModule,
    ],
})
export class AppModule {}
