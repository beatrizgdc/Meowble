import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './config/connDB';
import { ModuloAplicacao } from './utils/logger/logger';
import { LojaModule } from './lojas/lojaModule';
import { ProdutoModule } from './produtos/produtoModule';
import { publicModule } from './public/publicModule';
import { join } from 'path';
import { MigrationModule } from './migrations/migrationModule';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'src', 'public'),
        }),
        DatabaseModule,
        ModuloAplicacao,
        LojaModule,
        ProdutoModule,
        publicModule,
        MigrationModule,
    ],
})
export class AppModule {}
