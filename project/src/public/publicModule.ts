import { Module } from '@nestjs/common';
import { publicController } from './publicController';

@Module({
    imports: [],
    controllers: [publicController],
    providers: [],
})
export class publicModule {}
