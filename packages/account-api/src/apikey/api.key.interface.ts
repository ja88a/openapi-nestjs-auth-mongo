import { Types } from 'mongoose';
import { ApiKeyCreateDto } from './dto/api.key.create.dto';

export interface IApiKeyDocument {
    _id: Types.ObjectId;
    secret: string;
    passphrase: string;
    encryptionKey: string;
}

export interface IApiKeyCreate extends ApiKeyCreateDto {
    key?: string;
    secret?: string;
    passphrase?: string;
    encryptionKey?: string;
}

export interface IApiKeyAuthPayload {
    _id: string;
    key: string;
    name: string;
    description: string;
}

export interface IApiKeyAuthRequestHashedData {
    key: string;
    timestamp: number;
    hash: string;
}
