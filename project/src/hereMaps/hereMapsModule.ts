import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HereMapsService } from './hereMapsService';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
    ],
    providers: [HereMapsService],
    exports: [HereMapsService],
})
export class HereMapsModule {}
