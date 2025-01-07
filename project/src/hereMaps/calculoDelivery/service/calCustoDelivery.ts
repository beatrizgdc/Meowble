import { Injectable } from '@nestjs/common';
import { GetEstimativaTempoService } from './calcTempoService';
import { GetDeliveryCustoDto } from '../dto/hereMapsCustoDeliveryDtos';

@Injectable()
export class GetDeliveryCustoService {
    constructor(
        private readonly getEstimatedTimeService: GetEstimativaTempoService
    ) {}

    calculateDeliveryCost(
        distanciaKm: number,
        estimatedTimeMin: number
    ): number {
        const costPerKm = 2.5; // Custo por quilômetro
        const costPerMinute = 0.5; // Custo por minuto
        const fixedCost = 5.0; // Custo fixo da entrega

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
        const estimatedTimeMin =
            await this.getEstimatedTimeService.getEstimatedTime({
                origemLatitude,
                origemLongitude,
                destinoLatitude,
                destinoLongitude,
            });

        const totalCost = this.calculateDeliveryCost(
            distanciaKm,
            estimatedTimeMin
        );

        return { estimatedTimeMin, totalCost };
    }
}
