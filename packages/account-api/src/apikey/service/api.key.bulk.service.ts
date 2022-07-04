/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from 'src/database/database.decorator';
import { Model } from 'mongoose';
import { ApiKeyDocument, ApiKeyEntity } from '../schema/api.key.schema';

@Injectable()
export class ApiKeyBulkService {
    constructor(
        @DatabaseEntity(ApiKeyEntity.name)
        private readonly authApiModel: Model<ApiKeyDocument>
    ) {}

    async deleteMany(find: Record<string, any>) {
        return this.authApiModel.deleteMany(find);
    }
}
