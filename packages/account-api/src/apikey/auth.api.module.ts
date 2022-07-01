import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyGuard } from 'src/auth/guard/api-key/auth.api-key.guard';
import { ApiKeyStrategy } from 'src/auth/guard/api-key/auth.api-key.strategy';
import { JwtStrategy } from 'src/auth/guard/jwt/auth.jwt.strategy';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {
    AuthApiDatabaseName,
    AuthApiEntity,
    AuthApiSchema,
} from './schema/auth.api.schema';
import { AuthApiBulkService } from './service/auth.api.bulk.service';
import { AuthApiService } from './service/auth.api.service';

@Module({
    providers: [
        AuthApiService,
        AuthApiBulkService,
        JwtStrategy,
        ApiKeyStrategy,
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard,
        },
    ],
    exports: [ AuthApiService, AuthApiBulkService],
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
export class AuthApiModule {}
