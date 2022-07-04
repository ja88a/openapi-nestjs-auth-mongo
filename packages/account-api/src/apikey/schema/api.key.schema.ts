import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Data model of the API Access Authentication
 */
@Schema({ timestamps: true, versionKey: false })
export class ApiKeyEntity {

    /** Name of the API set */
    @Prop({
        required: true,
    })
    name: string;

    /** Description of the API set */
    @Prop({
        required: false,
    })
    description?: string;

    /** Unique key of the API set */
    @Prop({
        required: true,
        trim: true,
        unique: true,
    })
    key: string;

    /** Hash of the API decryption key */
    @Prop({
        required: true,
        trim: true,
    })
    hash: string;

    /** API Encryption key */
    @Prop({
        required: true,
        trim: true,
    })
    encryptionKey: string;

    /** Passphrase */
    @Prop({
        required: true,
        trim: true,
        minLength: 16,
        maxLength: 16,
    })
    passphrase: string;

    /** API key active status */
    @Prop({
        required: true,
    })
    isActive: boolean;
}

/** DB default collection name for the Authentication API Key documents */
export const ApiKeyDatabaseName = 'apikeys';

/** DB schema for the Authentication API Keys */
export const ApiKeySchema = SchemaFactory.createForClass(ApiKeyEntity);

/** DB document for the Authentication API Key */
export type ApiKeyDocument = ApiKeyEntity & Document;
