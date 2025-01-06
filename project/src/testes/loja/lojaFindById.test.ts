import { LojaService } from '../../models/lojas/service/lojaService';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { LojaDocument } from '../../models/lojas/schema/lojaSchema';
import { LojaRepository } from '../../models/lojas/repo/lojaRepo';
import { HereMapsService } from '../../api/hereMaps/hereMapsService';

describe('LojaService', () => {
    let lojaService: LojaService;
    let lojaModelMock: any;
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

        lojaModelMock = {
            findById: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(lojaData),
        };

        lojaRepositoryMock = {
            create: jest.fn().mockResolvedValue(lojaData),
            findAll: jest.fn().mockResolvedValue([lojaData]),
            count: jest.fn().mockResolvedValue(1),
            findById: jest.fn().mockResolvedValue(lojaData),
            findByUf: jest.fn().mockResolvedValue([lojaData]),
            countByUf: jest.fn().mockResolvedValue(1),
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

    it('deve listar a loja por ID com os campos filtrados', async () => {
        const id = '67792c4b08eb0f4717b94127';
        const result = await lojaService.findById(id);

        expect(result.stores.length).toBe(1);
        expect(result.stores[0]).not.toHaveProperty('_id');
        expect(result.stores[0]).not.toHaveProperty('latitude');
        expect(result.stores[0]).not.toHaveProperty('longitude');
        expect(result.stores[0]).not.toHaveProperty('tempoDePreparo');
        expect(result.stores[0]).not.toHaveProperty('disponivelNoEstoque');
        expect(result.stores[0].lojaNome).toBe(lojaData.lojaNome);
        expect(result.limit).toBe(1);
        expect(result.offset).toBe(0);
        expect(result.total).toBe(1);

        expect(loggerMock.log).toHaveBeenCalledWith(
            `Loja com ID ${id} encontrada com sucesso 😸😸`
        );
    });

    it('deve registrar um aviso quando a loja com ID não for encontrada', async () => {
        const id = 'someNonExistentId';
        lojaRepositoryMock.findById.mockResolvedValueOnce(null);
        const result = await lojaService.findById(id);

        expect(result.stores.length).toBe(0);
        expect(result.limit).toBe(1);
        expect(result.offset).toBe(0);
        expect(result.total).toBe(0);

        expect(loggerMock.warn).toHaveBeenCalledWith(
            `Loja com ID ${id} não encontrada 😔`
        );
    });

    it('deve registrar um erro em caso de falha', async () => {
        const id = 'someId';
        const errorMessage = 'Erro ao buscar a loja com ID';
        lojaRepositoryMock.findById.mockRejectedValueOnce(
            new Error(errorMessage)
        );

        try {
            await lojaService.findById(id);
        } catch (error) {
            expect(loggerMock.error).toHaveBeenCalledWith(
                `Erro ao buscar a loja com ID ${id}: 😿😿`,
                expect.any(Error)
            );
        }
    });
});
