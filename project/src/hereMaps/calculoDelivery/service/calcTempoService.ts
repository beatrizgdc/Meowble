import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GetEstimativaTempoDto } from '../dto/hereMapsTempEstimadoDto';
import { ServicoDeLogger } from '../../../utils/logger/logger';
@Injectable()
export class GetEstimativaTempoService {
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly logger: ServicoDeLogger
    ) {
        const apiKey = this.configService.get<string>('HERE_MAPS_API_KEY');
        if (!apiKey) {
            this.logger.error(
                'A chave de API para o Here Maps não está definida.'
            );
            throw new Error(
                'A chave de API para o Here Maps não está definida.'
            );
        }
        this.apiKey = apiKey;
    }

    async getEstimatedTime(dto: GetEstimativaTempoDto): Promise<number> {
        const {
            origemLatitude,
            origemLongitude,
            destinoLatitude,
            destinoLongitude,
        } = dto;
        const url = `https://router.hereapi.com/v8/routes`;

        const params = {
            origin: `${origemLatitude},${origemLongitude}`,
            destination: `${destinoLatitude},${destinoLongitude}`,
            transportMode: 'car',
            return: 'summary',
            apiKey: this.apiKey,
        };

        this.logger.log('Iniciando a solicitação para obter o tempo estimado');

        try {
            const response = await this.httpService
                .get(url, { params })
                .toPromise();

            if (
                !response ||
                !response.data.routes ||
                response.data.routes.length === 0
            ) {
                this.logger.error(
                    'Nenhuma rota encontrada ao calcular o tempo estimado.'
                );
                throw new Error('Nenhuma rota encontrada');
            }

            const durationSeconds =
                response.data.routes[0]?.sections[0]?.summary?.duration || 0;
            const estimatedTime = Math.round(durationSeconds / 60);

            this.logger.log(
                `Tempo estimado calculado: ${estimatedTime} minutos.`
            );
            return estimatedTime;
        } catch (error) {
            this.logger.error('Erro ao obter tempo estimado:', error);
            throw new Error('Não foi possível calcular o tempo estimado.');
        }
    }
}
