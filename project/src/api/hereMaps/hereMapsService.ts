import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ServicoDeLogger } from '../../utils/logger/logger';

@Injectable()
export class HereMapsService {
    private readonly appId: string;
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly logger: ServicoDeLogger
    ) {
        this.appId = this.configService.get<string>('HERE_MAPS_APP_ID') || '';
        this.apiKey = this.configService.get<string>('HERE_MAPS_API_KEY') || '';
    }

    async getDistanceMatrix(
        origins: string[],
        destinations: string[]
    ): Promise<any> {
        const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origins.join(
            ','
        )}&destination=${destinations.join(',')}&apiKey=${this.apiKey}&app_id=${
            this.appId
        }`;

        this.logger.log(`Fetching distance matrix from ${url}`);

        const response = await this.httpService.get(url).toPromise();
        if (response && response.data) {
            return response.data;
        }
        this.logger.error(
            'Failed to fetch distance matrix data',
            'HereMapsService'
        );
        throw new Error('Failed to fetch distance matrix data');
    }

    async geocodeAddress(address: string): Promise<any> {
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${this.apiKey}&app_id=${this.appId}`;

        this.logger.log(`Fetching geocode data for address: ${address}`);

        const response = await this.httpService.get(url).toPromise();
        if (response && response.data) {
            return response.data;
        }
        this.logger.error('Failed to fetch geocode data', 'HereMapsService');
        throw new Error('Failed to fetch geocode data');
    }
}
