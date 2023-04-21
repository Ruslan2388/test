import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { configNestApp } from './config.main';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
};
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets(join(__dirname, '..', 'static'));
    await app.listen(3000);
    app.enableCors(options);
    app.use(cookieParser());
}
bootstrap();
