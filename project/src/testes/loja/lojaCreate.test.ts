import { LojaService } from '../../models/lojas/service/lojaService';
import { LojaRepository } from '../../models/lojas/repo/lojaRepo';
import { CreateLojaDto } from '../../models/lojas/dtos/lojaDto';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { HereMapsService } from '../../api/hereMaps/hereMapsService';

describe('LojaService', () => {
    let lojaService: LojaService;
    let lojaModelMock: jest.Mock;

    const lojaData: CreateLojaDto = {
        lojaNome: 'MEOWBLE',
        lojaTipo: 'PDV',
        disponivelNoEstoque: true,
        tempoDePreparo: 4,
        latitude: '-37.0530322',
        longitude: '-10.9833225',
        codigoPostal: '49037-050',
        numero: 800,
        uf: 'SP',
        pais: 'Brazil',
        lojaTelefone: '12345678',
    };

    beforeEach(async () => {
        lojaModelMock = jest.fn().mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({
                _id: 'someId',
                ...lojaData,
            }),
        }));

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LojaService,
                LojaRepository,
                {
                    provide: getModelToken('Loja'),
                    useValue: lojaModelMock,
                },
                {
                    provide: ServicoDeLogger,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                    },
                },
                {
                    provide: HereMapsService,
                    useValue: {},
                },
            ],
        }).compile();

        lojaService = module.get<LojaService>(LojaService);
    });

    it('deve criar uma nova loja', async () => {
        const result = await lojaService.create(lojaData);

        expect(result._id).toBe('someId');
        expect(result.lojaNome).toBe(lojaData.lojaNome);
        expect(lojaModelMock).toHaveBeenCalledWith(lojaData);
    });
});
