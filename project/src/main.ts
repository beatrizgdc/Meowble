import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PORT, HOST } from './config/dotenvConfig';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // EJS
    app.setBaseViewsDir(join(__dirname, '..', 'src/public/views'));
    app.setViewEngine('ejs');

    app.useStaticAssets(join(__dirname, '..', 'src/public/CSS'));

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Meowble')
        .setDescription('API para Meowbles')
        .setVersion('0.0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    const port = PORT as string | number;
    const host = HOST as string;

    await app.listen(port, host);
    console.log(`Aplicação rodando em http://${HOST}:${PORT}`);
    console.log(`Swagger disponível em http://${HOST}:${PORT}/swagger`);
}

bootstrap();
