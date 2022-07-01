import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/guard/jwt/auth.jwt.strategy';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import {
    AuthApiDatabaseName,
    AuthApiEntity,
    AuthApiSchema,
} from '../apikey/schema/auth.api.schema';
import { AuthService } from './service/auth.service';
import { ApiKeyGuard } from 'src/auth/guard/api-key/auth.api-key.guard';
import { AuthApiBulkService } from 'src/apikey/service/auth.api.bulk.service';
import { AuthApiService } from 'src/apikey/service/auth.api.service';
import { ApiKeyStrategy } from 'src/auth/guard/api-key/auth.api-key.strategy';

@Module({
    providers: [
        AuthService,
        AuthApiService,
        AuthApiBulkService,
        JwtStrategy,
        JwtRefreshStrategy,
        ApiKeyStrategy,
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard,
        },
    ],
    exports: [AuthService, AuthApiService, AuthApiBulkService],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: AuthApiEntity.name,
                    schema: AuthApiSchema,
                    collection: AuthApiDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class AuthModule {}
