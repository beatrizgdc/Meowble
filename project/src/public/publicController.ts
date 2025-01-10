import { Controller, Get, Render, Param } from '@nestjs/common';
import { ProdutoService } from '../produtos/service/produtoService';
import { LojaService } from '../lojas/service/lojaService';

@Controller()
export class PublicController {
    constructor(
        private readonly produtoService: ProdutoService,
        private readonly lojaService: LojaService
    ) {}

    @Get()
    @Render('index')
    async root() {
        const produtos = await this.produtoService.findAllProdutos();
        return { produtos };
    }

    @Get('/api/buscarProx/:cep') async encontrarLoja(
        @Param('cep') cep: string
    ) {
        const lojasProx = await this.lojaService.findByCep(cep);
        return lojasProx;
    }

    @Get('/produto-detalhes/:id')
    @Render('produto')
    async produtoDetalhes(@Param('id') id: string) {
        const produto = await this.produtoService.findProdutoById(id);
        return { produto };
    }
}
