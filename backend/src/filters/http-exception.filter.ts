import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { EntityNotFoundError } from 'typeorm';

/**
 * GlobalExceptionFilter - Manejo centralizado de errores
 * 
 * Implementa la regla: error-use-exception-filters de nestjs-best-practices
 * 
 * Características:
 * - Estandariza estructura de respuesta de errores
 * - Maneja errores de TypeORM (EntityNotFoundError)
 * - Maneja errores de GraphQL
 * - Registra errores para debugging
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        // Determinar el tipo de contexto (HTTP o GraphQL)
        const isGraphQL = this.isGraphQLContext(host);
        
        if (isGraphQL) {
            this.handleGraphQL(exception, host);
        } else {
            this.handleHTTP(exception, host);
        }
    }

    /**
     * Determina si estamos en contexto GraphQL
     */
    private isGraphQLContext(host: ArgumentsHost): boolean {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // GraphQL playground usa headers específicos
        return !response.locals;
    }

    /**
     * Maneja errores en contexto HTTP/REST
     */
    private handleHTTP(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as Record<string, unknown>;
                message = (responseObj.message as string) || exception.message;
                error = (responseObj.error as string) || HttpStatus[status];
            } else {
                message = exception.message;
                error = HttpStatus[status];
            }
        } else if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = 'Entidad no encontrada';
            error = 'Not Found';
        } else if (exception instanceof Error) {
            // Loggear errores no esperados
            this.logger.error(
                `Unhandled error: ${exception.message}`,
                exception.stack,
            );
            message = process.env.NODE_ENV === 'production' 
                ? 'Error interno del servidor' 
                : exception.message;
        }

        const responseBody = {
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        response.status(status).json(responseBody);
    }

    /**
     * Maneja errores en contexto GraphQL
     * Transforma errores HTTP a formato GraphQL
     */
    private handleGraphQL(exception: unknown, host: ArgumentsHost) {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let extensions: Record<string, unknown> = { code: 'INTERNAL_SERVER_ERROR' };

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as Record<string, unknown>;
                message = (responseObj.message as string) || exception.message;
            }
            
            extensions = {
                code: HttpStatus[status],
                status,
            };
        } else if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = 'Entidad no encontrada';
            extensions = { code: 'NOT_FOUND', status };
        } else if (exception instanceof Error) {
            this.logger.error(
                `Unhandled error: ${exception.message}`,
                exception.stack,
            );
            message = process.env.NODE_ENV === 'production'
                ? 'Error interno del servidor'
                : exception.message;
            extensions = { 
                code: 'INTERNAL_SERVER_ERROR',
                status,
                ...(process.env.NODE_ENV !== 'production' && { debug: exception.message }),
            };
        }

        // En GraphQL, lanzamos el error formato GraphQL
        throw new GraphQLError(message, {
            extensions: {
                ...extensions,
                status,
            },
        });
    }
}