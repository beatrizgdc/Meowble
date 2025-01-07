import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HereMapsService {
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        const apiKey = this.configService.get<string>('HERE_MAPS_API_KEY');
        if (!apiKey) {
            throw new Error(
                'A chave de API para o Here Maps não está definida.'
            );
        }
        this.apiKey = apiKey;
    }

    async getCoordinates(
        cep: string
    ): Promise<{ latitude: number; longitude: number }> {
        const response = await firstValueFrom(
            this.httpService.get(
                'https://geocode.search.hereapi.com/v1/geocode',
                {
                    params: {
                        q: cep,
                        apiKey: this.apiKey,
                    },
                }
            )
        );

        const location = response.data.items[0].position;
        return {
            latitude: location.lat,
            longitude: location.lng,
        };
    }
}
