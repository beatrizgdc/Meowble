import { LojaService } from '../service/lojaService';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { LojaDocument } from '../schema/lojaSchema';
import { LojaRepository } from '../repo/lojaRepo';
import { HereMapsService } from '../../hereMaps/hereMapsService';

describe('LojaService', () => {
    let lojaService: LojaService;
    let lojaRepositoryMock: any;
    let lojaData: LojaDocument;
    let loggerMock: { log: jest.Mock; error: jest.Mock; warn: jest.Mock };

    beforeEach(async () => {
        lojaData = {
            _id: 'someId',
            lojaID: '1',
            lojaNome: 'MEOWBLE',
            lojaTipo: 'PDV',
            disponivelNoEstoque: true,
            tempoDePreparo: 4,
            latitude: '-37.0530322',
            longitude: '-10.9833225',
            codigoPostal: '49037-050',
            numero: 800,
            pais: 'Brazil',
            lojaTelefone: '12345678',
            __v: 0,
            toObject: jest.fn().mockReturnValue({
                lojaID: '1',
                lojaNome: 'MEOWBLE',
                lojaTipo: 'PDV',
                codigoPostal: '49037-050',
                numero: 800,
                pais: 'Brazil',
                lojaTelefone: '12345678',
            }),
        } as unknown as LojaDocument;

        lojaRepositoryMock = {
            findAll: jest.fn().mockResolvedValue([lojaData]),
            count: jest.fn().mockResolvedValue(1),
        };

        loggerMock = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LojaService,
                {
                    provide: LojaRepository,
                    useValue: lojaRepositoryMock,
                },
                {
                    provide: ServicoDeLogger,
                    useValue: loggerMock,
                },
                {
                    provide: HereMapsService,
                    useValue: {}, // Mock vazio para satisfazer a dependência
                },
            ],
        }).compile();

        lojaService = module.get<LojaService>(LojaService);
    });

    it('deve listar as lojas com os campos filtrados (os que não quero mostrar)', async () => {
        const limit = 1;
        const offset = 0;
        const result = await lojaService.findAll(limit, offset);

        expect(result.stores.length).toBe(1);
        expect(result.stores[0]).not.toHaveProperty('latitude');
        expect(result.stores[0]).not.toHaveProperty('longitude');
        expect(result.stores[0]).not.toHaveProperty('tempoDePreparo');
        expect(result.stores[0]).not.toHaveProperty('disponivelNoEstoque');
        expect(result.stores[0].lojaNome).toBe(lojaData.lojaNome);
        expect(result.limit).toBe(limit);
        expect(result.offset).toBe(offset);
        expect(result.total).toBe(1);

        expect(loggerMock.log).toHaveBeenCalledWith(
            'Lojas listadas com sucesso 😸😸'
        );
    });

    it('deve registrar um aviso quando nenhuma loja for encontrada', async () => {
        lojaRepositoryMock.findAll.mockResolvedValueOnce([]);
        const limit = 1;
        const offset = 0;
        const result = await lojaService.findAll(limit, offset);

        expect(result.stores.length).toBe(0);

        expect(loggerMock.warn).toHaveBeenCalledWith(
            'Nenhuma loja encontrada 😔'
        );
    });

    it('deve registrar um erro em caso de falha', async () => {
        const errorMessage = 'Erro ao listar as lojas';
        lojaRepositoryMock.findAll.mockRejectedValueOnce(
            new Error(errorMessage)
        );
        const limit = 1;
        const offset = 0;

        try {
            await lojaService.findAll(limit, offset);
        } catch (error) {
            expect(loggerMock.error).toHaveBeenCalledWith(
                'Erro ao listar as lojas: 😿😿',
                expect.any(Error)
            );
        }
    });
});
