import { Injectable } from '@nestjs/common';
import { GetDeliveryCustoService } from './calCustoDelivery';
import { GetEstimativaTempoService } from './calcTempoService';
import { GetEstimativaTempoDto } from '../dto/hereMapsTempEstimadoDto';
import { GetDeliveryCustoDto } from '../dto/hereMapsCustoDeliveryDtos';

@Injectable()
export class HereMapsServiceDelivery {
    constructor(
        private readonly getEstimatedTimeService: GetEstimativaTempoService,
        private readonly getDeliveryCostService: GetDeliveryCustoService
    ) {}

    async getEstimatedTime(dto: GetEstimativaTempoDto): Promise<number> {
        return this.getEstimatedTimeService.getEstimatedTime(dto);
    }

    async getDeliveryCost(
        dto: GetDeliveryCustoDto
    ): Promise<{ estimatedTimeMin: number; totalCost: number }> {
        return this.getDeliveryCostService.getDeliveryCost(dto);
    }
}
