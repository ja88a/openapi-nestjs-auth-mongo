import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VersionInterceptor } from './interceptor/version.interceptor';

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: VersionInterceptor,
        },
    ],
    imports: [],
})
export class VersionModule {}
