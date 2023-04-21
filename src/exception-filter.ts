import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        if (process.env.envorinment !== 'production') {
            response.status(500).send({ error: exception.toString(), stack: exception.stack });
        } else {
            response.status(500).send('some error occurred');
        }
    }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        if (status === 400) {
            const errorResponse = {
                errorsMessages: [],
            };
            const responseBody: any = exception.getResponse();
            try {
                if (responseBody.message.length >= 2)
                    responseBody.message.forEach((m) =>
                        errorResponse.errorsMessages.push({
                            message: m.message,
                            field: m.field,
                        }),
                    );
                else errorResponse.errorsMessages.push({ message: responseBody.message[0].message, field: responseBody.message[0].field });
                return response.status(status).json(errorResponse);
            } catch (e) {
                response.status(status).json(errorResponse);
            }

            //   response.status(status).json({ message: responseBody.message });
        } else {
            response.sendStatus(status);
        }
    }
    // else if (status === 404) {
    //     response.status(404).json({ statusCode: status });
    // }
    // else {
    //     response.status(status).json({
    //         statusCode: status,
    //         timestamp: new Date().toISOString(),
    //         path: request.url,
    //     });
    // }
}
