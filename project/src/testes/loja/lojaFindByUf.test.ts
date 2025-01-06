import { LojaService } from '../../models/lojas/service/lojaService';
import { Test, TestingModule } from '@nestjs/testing';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { LojaDocument } from '../../models/lojas/schema/lojaSchema';
import { LojaRepository } from '../../models/lojas/repo/lojaRepo';
import { HereMapsService } from '../../api/hereMaps/hereMapsService';

describe('LojaService', () => {
    let lojaService: LojaService;
    let lojaRepositoryMock: any;
    let hereMapsServiceMock: any;
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
            uf: 'SP',
            __v: 0,
            toObject: jest.fn().mockReturnValue({
                lojaID: '1',
                lojaNome: 'MEOWBLE',
                lojaTipo: 'PDV',
                codigoPostal: '49037-050',
                numero: 800,
                pais: 'Brazil',
                lojaTelefone: '12345678',
                uf: 'SP',
            }),
        } as unknown as LojaDocument;

        lojaRepositoryMock = {
            findByUf: jest.fn().mockResolvedValue([lojaData]),
            countByUf: jest.fn().mockResolvedValue(1),
        };

        hereMapsServiceMock = {
            getCoordinates: jest.fn(),
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
                    provide: HereMapsService,
                    useValue: hereMapsServiceMock,
                },
                {
                    provide: ServicoDeLogger,
                    useValue: loggerMock,
                },
            ],
        }).compile();

        lojaService = module.get<LojaService>(LojaService);
    });

    it('deve listar lojas por UF com os campos filtrados', async () => {
        const uf = 'SP';
        const limit = 1;
        const offset = 0;
        const result = await lojaService.findByUf(uf, limit, offset);

        expect(result.stores.length).toBe(1);
        expect(result.stores[0]).not.toHaveProperty('_id');
        expect(result.stores[0]).not.toHaveProperty('latitude');
        expect(result.stores[0]).not.toHaveProperty('longitude');
        expect(result.stores[0]).not.toHaveProperty('tempoDePreparo');
        expect(result.stores[0]).not.toHaveProperty('disponivelNoEstoque');
        expect(result.stores[0].lojaNome).toBe(lojaData.lojaNome);
        expect(result.limit).toBe(limit);
        expect(result.offset).toBe(offset);
        expect(result.total).toBe(1);

        expect(loggerMock.log).toHaveBeenCalledWith(
            `Lojas na UF ${uf} listadas com sucesso 😸😸`
        );
    });

    it('deve registrar um aviso quando nenhuma loja for encontrada na UF', async () => {
        const uf = 'SP';
        lojaRepositoryMock.findByUf.mockResolvedValueOnce([]);
        lojaRepositoryMock.countByUf.mockResolvedValueOnce(0);
        const result = await lojaService.findByUf(uf);

        expect(result.stores.length).toBe(0);
        expect(result.limit).toBe(1);
        expect(result.offset).toBe(0);
        expect(result.total).toBe(0);

        expect(loggerMock.warn).toHaveBeenCalledWith(
            `Nenhuma loja encontrada na UF ${uf} 😔`
        );
    });

    it('deve registrar um erro em caso de falha', async () => {
        const uf = 'SP';
        const errorMessage = 'Erro ao listar as lojas na UF';
        lojaRepositoryMock.findByUf.mockRejectedValueOnce(
            new Error(errorMessage)
        );

        try {
            await lojaService.findByUf(uf);
        } catch (error) {
            expect(loggerMock.error).toHaveBeenCalledWith(
                `Erro ao listar as lojas na UF ${uf}: 😿😿`,
                expect.any(Error)
            );
        }
    });
});
