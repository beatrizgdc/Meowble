import { Injectable } from '@nestjs/common';
import { GetEstimativaTempoService } from './calcTempoService';
import { GetDeliveryCustoDto } from '../dto/hereMapsCustoDeliveryDtos';
import { ServicoDeLogger } from '../../../utils/logger/logger';
@Injectable()
export class GetDeliveryCustoService {
    constructor(
        private readonly getEstimatedTimeService: GetEstimativaTempoService,
        private readonly logger: ServicoDeLogger
    ) {}

    calculateDeliveryCost(
        distanciaKm: number,
        estimatedTimeMin: number
    ): number {
        const costPerKm = 0.2;
        const costPerMinute = 0.25;
        const fixedCost = 5.0;

        return (
            fixedCost +
            distanciaKm * costPerKm +
            estimatedTimeMin * costPerMinute
        );
    }

    async getDeliveryCost(
        dto: GetDeliveryCustoDto
    ): Promise<{ estimatedTimeMin: number; totalCost: number }> {
        const {
            origemLatitude,
            origemLongitude,
            destinoLatitude,
            destinoLongitude,
            distanciaKm,
        } = dto;

        this.logger.log('Iniciando o cálculo do custo de entrega');

        const estimatedTimeMin =
            await this.getEstimatedTimeService.getEstimatedTime({
                origemLatitude,
                origemLongitude,
                destinoLatitude,
                destinoLongitude,
            });

        this.logger.log(
            `Tempo estimado para a entrega: ${estimatedTimeMin} minutos`
        );

        const totalCost = this.calculateDeliveryCost(
            distanciaKm,
            estimatedTimeMin
        );

        this.logger.log(
            `Custo total da entrega calculado: ${totalCost} unidades monetárias`
        );

        return { estimatedTimeMin, totalCost };
    }
}
