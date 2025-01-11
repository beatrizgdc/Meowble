import { Module } from '@nestjs/common';
import { ClearAndCreateStoreMigration } from './collection';

@Module({
    providers: [ClearAndCreateStoreMigration],
})
export class MigrationModule {}
