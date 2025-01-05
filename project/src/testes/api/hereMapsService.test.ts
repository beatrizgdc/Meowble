import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HereMapsService } from '../../api/hereMaps/hereMapsService';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { ServicoDeLogger } from '../../utils/logger/logger';

describe('HereMapsService', () => {
    let service: HereMapsService;
    let logger: ServicoDeLogger;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
            ],
            providers: [
                HereMapsService,
                {
                    provide: ServicoDeLogger,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<HereMapsService>(HereMapsService);
        logger = module.get<ServicoDeLogger>(ServicoDeLogger);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return distance matrix data', async () => {
        const response: AxiosResponse<any> = {
            data: { distance: 123 },
            status: 200,
            statusText: 'OK',
            headers: new AxiosHeaders(),
            config: {
                headers: new AxiosHeaders(),
            },
        };

        jest.spyOn(service['httpService'], 'get').mockImplementationOnce(() =>
            of(response)
        );

        const origins = ['52.53086,13.38469'];
        const destinations = ['52.52278,13.41267'];
        const result = await service.getDistanceMatrix(origins, destinations);

        expect(result).toEqual({ distance: 123 });
        expect(logger.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^Fetching distance matrix from https:\/\/router\.hereapi\.com\/v8\/routes\?transportMode=car&origin=52\.53086,13\.38469&destination=52\.52278,13\.41267&apiKey=[^&]+&app_id=[^&]+$/
            )
        );
    });

    it('should return geocode data', async () => {
        const response: AxiosResponse<any> = {
            data: { location: { lat: 52.53086, lng: 13.38469 } },
            status: 200,
            statusText: 'OK',
            headers: new AxiosHeaders(),
            config: {
                headers: new AxiosHeaders(),
            },
        };

        jest.spyOn(service['httpService'], 'get').mockImplementationOnce(() =>
            of(response)
        );

        const address = 'Av. Paulista, 1000, São Paulo';
        const result = await service.geocodeAddress(address);

        expect(result).toEqual({ location: { lat: 52.53086, lng: 13.38469 } });
        expect(logger.log).toHaveBeenCalledWith(
            `Fetching geocode data for address: ${address}`
        );
    });
});
