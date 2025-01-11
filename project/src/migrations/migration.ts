import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app';
import { ClearAndCreateStoreMigration } from './collection';
import { getConnectionToken } from '@nestjs/mongoose';

async function runMigration() {
    const app = await NestFactory.createApplicationContext(AppModule);

    // Conexão com o MongoDB
    const connection = await app.get(getConnectionToken());
    const db = connection.db;

    // Executar a migração
    const migration = app.get(ClearAndCreateStoreMigration);
    await migration.up(db, connection);

    await app.close();
    console.log('Migração executada com sucesso!');
}

runMigration().catch((err) => {
    console.error('Erro ao executar a migração', err);
});
