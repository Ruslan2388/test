import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { configNestApp } from './config.main';
const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
};
async function bootstrap() {
    const baseApp = await NestFactory.create(AppModule);
    const app = configNestApp(baseApp);
    await app.listen(5000);
    app.enableCors(options);
    app.use(cookieParser());
}
bootstrap();
