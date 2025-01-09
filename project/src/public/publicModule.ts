import { Module } from '@nestjs/common';
import { PublicController } from './publicController';
import { ProdutoModule } from '../produtos/produtoModule';

@Module({
    imports: [ProdutoModule],
    controllers: [PublicController],
    providers: [],
})
export class publicModule {}
