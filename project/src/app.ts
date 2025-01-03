import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/connDB';
import { ServicoDeLogger, ModuloAplicacao } from './utils/logger/logger';

@Module({
  imports: [DatabaseModule, ModuloAplicacao],
})
export class AppModule {}
