import { Test, TestingModule } from '@nestjs/testing';
import { findByCepServiceService } from '../service/findByCep/findByCepService';
import { LojaRepository } from '../repo/lojaRepo';
import { ServicoDeLogger } from '../../utils/logger/logger';
import { HereMapsService } from '../../hereMaps/buscarLatLong/service/hereMapsService';
import { CorreiosService } from '../../correios/correiosService';
import { HereMapsServiceDelivery } from '../../hereMaps/calculoDelivery/service/hereMapsDeliveryService';
import { CoordinatesDto } from '../../hereMaps/buscarLatLong/dto/hereMapsDto';

describe('findByCepServiceService', () => {
    let service: findByCepServiceService;
    let lojaRepository: LojaRepository;
    let logger: ServicoDeLogger;
    let hereMapsService: HereMapsService;
    let correiosService: CorreiosService;
    let hereMapsServiceDelivery: HereMapsServiceDelivery;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                findByCepServiceService,
                {
                    provide: LojaRepository,
                    useValue: { findAll: jest.fn(), count: jest.fn() },
                },
                {
                    provide: ServicoDeLogger,
                    useValue: { log: jest.fn(), error: jest.fn() },
                },
                {
                    provide: HereMapsService,
                    useValue: { getCoordinates: jest.fn() },
                },
                { provide: CorreiosService, useValue: { getFrete: jest.fn() } },
                {
                    provide: HereMapsServiceDelivery,
                    useValue: { getDeliveryCost: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<findByCepServiceService>(findByCepServiceService);
        lojaRepository = module.get<LojaRepository>(LojaRepository);
        logger = module.get<ServicoDeLogger>(ServicoDeLogger);
        hereMapsService = module.get<HereMapsService>(HereMapsService);
        correiosService = module.get<CorreiosService>(CorreiosService);
        hereMapsServiceDelivery = module.get<HereMapsServiceDelivery>(
            HereMapsServiceDelivery
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should log an error and return an error response if coordinates cannot be obtained', async () => {
        const cep = '12345-678';
        const mockCoordinates: CoordinatesDto = {
            latitude: NaN,
            longitude: NaN,
        };
        jest.spyOn(hereMapsService, 'getCoordinates').mockResolvedValue(
            mockCoordinates
        );

        const result = await service.findByCep(cep);

        expect(logger.error).toHaveBeenCalledWith(
            'Erro ao buscar lojas por CEP: 12345-678 | erro tryCacth findByCep',
            expect.any(Error)
        );
        expect(result).toEqual({
            mensagem: 'Erro ao buscar lojas por CEP.',
            detalhes: {
                mensagem: 'Não foi possível obter as coordenadas do CEP.',
                stack: expect.any(String), // Aceita qualquer stack trace como válido
            },
        });
    });
});
