import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { ErrorExceptionFilter, HttpExceptionFilter } from './exception-filter';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

export function configNestApp(app): INestApplication {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const errorsForResponse = [];

                errors.forEach((e) => {
                    //    errorsForResponse.push({ field: e.property });
                    const constrainsKeys = Object.keys(e.constraints);
                    constrainsKeys.forEach((cKey) => {
                        errorsForResponse.push({
                            message: e.constraints[cKey],
                            field: e.property,
                        });
                    });
                });

                throw new BadRequestException(errorsForResponse);
            },
        }),
    );
    app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    return app;
}
