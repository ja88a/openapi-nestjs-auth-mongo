import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
    Type,
    mixin,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import ms from 'ms';
import { RESPONSE_CUSTOM_TIMEOUT_META_KEY } from '../response.constant';

export function ResponseTimeoutInterceptor(
    seconds: string
): Type<NestInterceptor> {
    @Injectable()
    class MixinResponseTimeoutInterceptor
        implements NestInterceptor<Promise<any>>
    {
        async intercept(
            context: ExecutionContext,
            next: CallHandler
        ): Promise<Observable<Promise<any> | string>> {
            if (context.getType() === 'http') {
                return next.handle().pipe(
                    timeout(ms(seconds)),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException({
                                statusCode:
                                    ENUM_STATUS_CODE_ERROR.REQUEST_TIMEOUT,
                                message: 'http.clientError.requestTimeOut',
                            });
                        }
                        return throwError(() => err);
                    })
                );
            }

            return next.handle();
        }
    }

    return mixin(MixinResponseTimeoutInterceptor);
}

export class ResponseTimeoutDefaultInterceptor
    implements NestInterceptor<Promise<any>>
{
    constructor(
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        if (context.getType() === 'http') {
            const customTimeout = this.reflector.get<boolean>(
                RESPONSE_CUSTOM_TIMEOUT_META_KEY,
                context.getHandler()
            );

            if (!customTimeout) {
                const defaultTimeout: number = this.configService.get<number>(
                    'middleware.timeout.in'
                );
                return next.handle().pipe(
                    timeout(defaultTimeout),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException({
                                statusCode:
                                    ENUM_STATUS_CODE_ERROR.REQUEST_TIMEOUT,
                                message: 'http.clientError.requestTimeOut',
                            });
                        }
                        return throwError(() => err);
                    })
                );
            }
        }

        return next.handle();
    }
}
