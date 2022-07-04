import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyGuard } from 'src/auth/guard/api-key/auth.api-key.guard';
import { ApiKeyStrategy } from 'src/auth/guard/api-key/auth.api-key.strategy';
import { JwtStrategy } from 'src/auth/guard/jwt/auth.jwt.strategy';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {
    ApiKeyDatabaseName,
    ApiKeyEntity,
    ApiKeySchema,
} from './schema/api.key.schema';
import { ApiKeyBulkService } from './service/api.key.bulk.service';
import { ApiKeyService } from './service/api.key.service';

@Module({
    providers: [
        ApiKeyService,
        ApiKeyBulkService,
        JwtStrategy,
        ApiKeyStrategy,
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard,
        },
    ],
    exports: [ ApiKeyService, ApiKeyBulkService],
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
export class ApiKeyAuthModule {}
