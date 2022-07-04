import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/guard/jwt/auth.jwt.strategy';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import {
    ApiKeyDatabaseName,
    ApiKeyEntity,
    ApiKeySchema,
} from '../apikey/schema/api.key.schema';
import { AuthService } from './service/auth.service';
import { ApiKeyGuard } from 'src/auth/guard/api-key/auth.api-key.guard';
import { ApiKeyBulkService } from 'src/apikey/service/api.key.bulk.service';
import { ApiKeyService } from 'src/apikey/service/api.key.service';
import { ApiKeyStrategy } from 'src/auth/guard/api-key/auth.api-key.strategy';

@Module({
    providers: [
        AuthService,
        ApiKeyService,
        ApiKeyBulkService,
        JwtStrategy,
        JwtRefreshStrategy,
        ApiKeyStrategy,
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard,
        },
    ],
    exports: [AuthService, ApiKeyService, ApiKeyBulkService],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ApiKeyEntity.name,
                    schema: ApiKeySchema,
                    collection: ApiKeyDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class AuthModule {}
