import { Controller, Get, Render, Param } from '@nestjs/common';
import { ProdutoService } from '../produtos/service/produtoService';

@Controller()
export class PublicController {
    constructor(private readonly produtoService: ProdutoService) {}

    @Get()
    @Render('index')
    async root() {
        const produtos = await this.produtoService.findAllProdutos();
        return { produtos };
    }

    @Get('/produto-detalhes/:id')
    @Render('produto')
    async produtoDetalhes(@Param('id') id: string) {
        const produto = await this.produtoService.findProdutoById(id);
        return { produto };
    }
}
