import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HereMapsService } from './buscarLatLong/service/hereMapsService';
import { HereMapsServiceDelivery } from './calculoDelivery/service/hereMapsDeliveryService';
import { GetDeliveryCustoService } from './calculoDelivery/service/calCustoDelivery';
import { GetEstimativaTempoService } from './calculoDelivery/service/calcTempoService';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
    ],
    providers: [
        HereMapsService,
        HereMapsServiceDelivery,
        GetDeliveryCustoService,
        GetEstimativaTempoService,
    ],
    exports: [
        HereMapsService,
        HereMapsServiceDelivery,
        GetDeliveryCustoService,
        GetEstimativaTempoService,
    ],
})
export class HereMapsModule {}
