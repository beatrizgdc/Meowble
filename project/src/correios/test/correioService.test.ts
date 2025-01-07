import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosService } from '../correiosService';
import axios from 'axios';
import { CorreiosDto } from '../correiosDTO';

jest.mock('axios');

describe('CorreiosService', () => {
    let service: CorreiosService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CorreiosService],
        }).compile();
        service = module.get<CorreiosService>(CorreiosService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should call API and return data', async () => {
        const correiosDto: CorreiosDto = {
            servico: '04014',
            cepOrigem: '01311000',
            cepDestino: '22041001',
            Peso: '1',
            Formato: '1',
            Comprimento: '20',
            Altura: '10',
            Largura: '15',
            Diametro: '0',
            MaoPropria: 'N',
            ValorDeclarado: '0',
            AvisoRecebimento: 'N',
        };
        const responseData = [
            {
                status: 200,
                mensagemPrecoAgencia: 'Postagem nas agências',
                prazo: '1 dia útil',
                url: 'https://www.correios.com.br/estrutura-da-pagina/precos-e-prazos/imagens/sedex.png',
                mensagemPrecoPPN: 'Postagem no App ou site dos Correios',
                codProdutoAgencia: '04014',
                precoPPN: 'R$ 26,94',
                codProdutoPPN: '41955',
                mensagemPrazo: 'Prazo de entrega',
                msg: ' ',
                precoAgencia: 'R$ 36,80',
                urlTitulo: 'Sedex a encomenda expressa dos Correios',
            },
        ];
        (axios.post as jest.Mock).mockResolvedValue({ data: responseData });
        const result = await service.obterPrecosEPrazos(correiosDto);
        expect(result).toEqual(responseData);
        expect(axios.post).toHaveBeenCalledWith(service['apiUrl'], correiosDto);
    });
    it('should handle errors', async () => {
        const correiosDto: CorreiosDto = {
            servico: '04014',
            cepOrigem: '01311000',
            cepDestino: '22041001',
            Peso: '2',
            Formato: '1',
            Comprimento: '20',
            Altura: '10',
            Largura: '15',
            Diametro: '0',
            MaoPropria: 'N',
            ValorDeclarado: '0',
            AvisoRecebimento: 'N',
        };
        (axios.post as jest.Mock).mockRejectedValue(
            new Error('Erro na chamada à API')
        );
        await expect(service.obterPrecosEPrazos(correiosDto)).rejects.toThrow(
            'Erro na chamada à API dos Correios'
        );
    });
});
