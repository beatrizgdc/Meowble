import { Module } from '@nestjs/common';
import { PublicController } from './publicController';
import { ProdutoModule } from '../produtos/produtoModule';
import { LojaModule } from '../lojas/lojaModule';

@Module({
    imports: [ProdutoModule, LojaModule],
    controllers: [PublicController],
    providers: [],
})
export class publicModule {}
