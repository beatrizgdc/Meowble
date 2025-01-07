import { Test, TestingModule } from '@nestjs/testing';
import { HereMapsServiceDelivery } from '../service/hereMapsDeliveryService';
import { GetEstimativaTempoService } from '../service/calcTempoService';
import { GetDeliveryCustoService } from '../service/calCustoDelivery';
import { GetEstimativaTempoDto } from '../dto/hereMapsTempEstimadoDto';
import { GetDeliveryCustoDto } from '../dto/hereMapsCustoDeliveryDtos';

describe('HereMapsServiceDelivery', () => {
    let service: HereMapsServiceDelivery;
    let getEstimatedTimeService: GetEstimativaTempoService;
    let getDeliveryCostService: GetDeliveryCustoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HereMapsServiceDelivery,
                {
                    provide: GetEstimativaTempoService,
                    useValue: {
                        getEstimatedTime: jest.fn().mockResolvedValue(10),
                    },
                },
                {
                    provide: GetDeliveryCustoService,
                    useValue: {
                        getDeliveryCost: jest.fn().mockResolvedValue({
                            estimatedTimeMin: 10,
                            totalCost: 20,
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<HereMapsServiceDelivery>(HereMapsServiceDelivery);
        getEstimatedTimeService = module.get<GetEstimativaTempoService>(
            GetEstimativaTempoService
        );
        getDeliveryCostService = module.get<GetDeliveryCustoService>(
            GetDeliveryCustoService
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return estimated time', async () => {
        const dto: GetEstimativaTempoDto = {
            origemLatitude: -23.55052,
            origemLongitude: -46.633308,
            destinoLatitude: -23.54052,
            destinoLongitude: -46.633308,
        };
        const estimatedTime = await service.getEstimatedTime(dto);
        expect(estimatedTime).toBe(10);
    });

    it('should return delivery cost and estimated time', async () => {
        const dto: GetDeliveryCustoDto = {
            origemLatitude: -23.55052,
            origemLongitude: -46.633308,
            destinoLatitude: -23.54052,
            destinoLongitude: -46.633308,
            distanciaKm: 6,
        };
        const result = await service.getDeliveryCost(dto);
        expect(result).toEqual({
            estimatedTimeMin: 10,
            totalCost: 20,
        });
    });
});
