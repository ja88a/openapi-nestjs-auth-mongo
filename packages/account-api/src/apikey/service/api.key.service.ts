/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from 'src/database/database.decorator';
import { Model } from 'mongoose';
import { ApiKeyDocument, ApiKeyEntity } from '../schema/api.key.schema';
import { IDatabaseFindAllOptions } from 'src/database/database.interface';
import { plainToInstance } from 'class-transformer';
import {
    IApiKeyDocument,
    IApiKeyAuthRequestHashedData,
    IApiKeyCreate,
} from '../api.key.interface';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { ConfigService } from '@nestjs/config';
import { HelperHashService } from 'src/utils/helper/service/helper.hash.service';
import { HelperEncryptionService } from 'src/utils/helper/service/helper.encryption.service';
import { ApiKeyUpdateDto } from 'src/apikey/dto/api.key.update.dto';
import { ApiKeyGetSerialization } from 'src/apikey/serialization/api.key.get.serialization';
import { ApiKeyListSerialization } from 'src/apikey/serialization/api.key.list.serialization';

@Injectable()
export class ApiKeyService {
    private readonly env: string;

    constructor(
        @DatabaseEntity(ApiKeyEntity.name)
        private readonly authApiModel: Model<ApiKeyDocument>,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService,
        private readonly helperHashService: HelperHashService,
        private readonly helperEncryptionService: HelperEncryptionService
    ) {
        this.env = this.configService.get<string>('app.env');
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<ApiKeyDocument[]> {
        const apiKeys = this.authApiModel.find(find).select({
            name: 1,
            key: 1,
            isActive: 1,
            createdAt: 1,
        });

        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            apiKeys.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            apiKeys.sort(options.sort);
        }

        return apiKeys.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.authApiModel.countDocuments(find);
    }

    async findOneById(_id: string): Promise<ApiKeyDocument> {
        return this.authApiModel.findById(_id).lean();
    }

    async findOne(find?: Record<string, any>): Promise<ApiKeyDocument> {
        return this.authApiModel.findOne(find).lean();
    }

    async findOneByKey(key: string): Promise<ApiKeyDocument> {
        return this.authApiModel.findOne({ key }).lean();
    }

    async serializationList(
        data: ApiKeyDocument[]
    ): Promise<ApiKeyListSerialization[]> {
        return plainToInstance(ApiKeyListSerialization, data);
    }

    async serializationGet(
        data: ApiKeyDocument
    ): Promise<ApiKeyGetSerialization> {
        return plainToInstance(ApiKeyGetSerialization, data);
    }

    async inactive(_id: string): Promise<ApiKeyDocument> {
        const authApi: ApiKeyDocument = await this.authApiModel.findById(_id);

        authApi.isActive = false;
        return authApi.save();
    }

    async active(_id: string): Promise<ApiKeyDocument> {
        const authApi: ApiKeyDocument = await this.authApiModel.findById(_id);

        authApi.isActive = true;
        return authApi.save();
    }

    async create({
        name,
        description,
        key,
        secret,
        passphrase,
        encryptionKey,
    }: IApiKeyCreate): Promise<IApiKeyDocument> {
        key = key ? key : await this.createKey();
        secret = secret ? secret : await this.createSecret();
        passphrase = passphrase ? passphrase : await this.createPassphrase();
        encryptionKey = encryptionKey
            ? encryptionKey
            : await this.createEncryptionKey();
        const hash: string = await this.createHashApiKey(key, secret);

        const create: ApiKeyDocument = new this.authApiModel({
            name,
            description,
            key,
            hash,
            passphrase,
            encryptionKey,
            isActive: true,
        });

        await create.save();

        return {
            _id: create._id,
            secret,
            passphrase,
            encryptionKey,
        };
    }

    async updateOneById(
        _id: string,
        { name, description }: ApiKeyUpdateDto
    ): Promise<ApiKeyDocument> {
        const authApi: ApiKeyDocument = await this.authApiModel.findById(_id);

        authApi.name = name;
        authApi.description = description;

        return authApi.save();
    }

    async updateHashById(_id: string): Promise<IApiKeyDocument> {
        const authApi: ApiKeyDocument = await this.authApiModel.findById(_id);
        const secret: string = await this.createSecret();
        const hash: string = await this.createHashApiKey(authApi.key, secret);
        const passphrase: string = await this.createPassphrase();
        const encryptionKey: string = await this.createEncryptionKey();

        authApi.hash = hash;
        authApi.passphrase = passphrase;
        authApi.encryptionKey = encryptionKey;

        await authApi.save();

        return {
            _id: authApi._id,
            secret,
            passphrase,
            encryptionKey,
        };
    }

    async deleteOneById(_id: string): Promise<ApiKeyDocument> {
        return this.authApiModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<ApiKeyDocument> {
        return this.authApiModel.findOneAndDelete(find);
    }

    async createKey(): Promise<string> {
        return this.helperStringService.random(25, {
            safe: false,
            upperCase: true,
            prefix: this.env === 'production' ? 'production_' : 'development_',
        });
    }

    async createEncryptionKey(): Promise<string> {
        return this.helperStringService.random(15, {
            safe: false,
            upperCase: true,
            prefix: this.env === 'production' ? 'production_' : 'development_',
        });
    }

    async createSecret(): Promise<string> {
        return this.helperStringService.random(35, {
            safe: false,
            upperCase: true,
        });
    }

    async createPassphrase(): Promise<string> {
        return this.helperStringService.random(16, {
            safe: true,
        });
    }

    async createHashApiKey(key: string, secret: string): Promise<string> {
        return this.helperHashService.sha256(`${key}:${secret}`);
    }

    async validateHashApiKey(
        hashFromRequest: string,
        hash: string
    ): Promise<boolean> {
        return this.helperHashService.sha256Compare(hashFromRequest, hash);
    }

    async decryptApiKey(
        apiKeyHashed: string,
        secretKey: string,
        passphrase: string
    ): Promise<IApiKeyAuthRequestHashedData> {
        const decrypted = this.helperEncryptionService.aes256Decrypt(
            apiKeyHashed,
            secretKey,
            passphrase
        );

        return JSON.parse(decrypted);
    }

    async encryptApiKey(
        data: IApiKeyAuthRequestHashedData,
        secretKey: string,
        passphrase: string
    ): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            data,
            secretKey,
            passphrase
        );
    }

    async createBasicToken(
        clientId: string,
        clientSecret: string
    ): Promise<string> {
        const token = `${clientId}:${clientSecret}`;
        return this.helperEncryptionService.base64Decrypt(token);
    }

    async validateBasicToken(
        clientBasicToken: string,
        ourBasicToken: string
    ): Promise<boolean> {
        return this.helperEncryptionService.base64Compare(
            clientBasicToken,
            ourBasicToken
        );
    }
}
