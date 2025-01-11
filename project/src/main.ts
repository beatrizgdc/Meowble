import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

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

    await app.listen(3000);
    console.log(`Aplicação rodando em http://localhost:3000`);

    // await app.listen(3000, '18.209.56.159', () => {
    //     console.log('Aplicação rodando em http://18.209.56.159:3000');
    // });
    // console.log(`Swagger disponível em http://18.209.56.159:3000/swagger`);
}

bootstrap();
