import { Module } from '@nestjs/common';
import { CorreiosService } from './correiosService';

@Module({
    providers: [CorreiosService],
    exports: [CorreiosService],
})
export class CorreiosModule {}
