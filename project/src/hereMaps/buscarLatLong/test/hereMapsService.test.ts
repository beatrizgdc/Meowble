import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { HereMapsService } from '../service/hereMapsService';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { CoordinatesDto } from '../dto/hereMapsDto';

describe('HereMapsService', () => {
    let service: HereMapsService;
    let httpService: HttpService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HereMapsService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest
                            .fn()
                            .mockReturnValue('YOUR_HERE_MAPS_API_KEY'),
                    },
                },
            ],
        }).compile();

        service = module.get<HereMapsService>(HereMapsService);
        httpService = module.get<HttpService>(HttpService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should throw an error if the API key is not defined', () => {
        jest.spyOn(configService, 'get').mockReturnValue(undefined);

        expect(() => new HereMapsService(httpService, configService)).toThrow(
            'A chave de API para o Here Maps não está definida.'
        );
    });

    it('should return coordinates for a valid cep', async () => {
        const result: AxiosResponse = {
            data: {
                items: [
                    {
                        position: {
                            lat: -23.55052,
                            lng: -46.633308,
                        },
                    },
                ],
            },
            status: 200,
            statusText: 'OK',
            headers: new AxiosHeaders(),
            config: {
                headers: new AxiosHeaders(),
            },
        };

        jest.spyOn(httpService, 'get').mockReturnValue(of(result));

        const coordinates: CoordinatesDto = await service.getCoordinates(
            '01001-000'
        );
        expect(coordinates).toEqual({
            latitude: -23.55052,
            longitude: -46.633308,
        } as CoordinatesDto);
    });
});
