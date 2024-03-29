import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { ApiKeyEntity } from 'src/apikey/schema/api.key.schema';
import { IAwsS3Response } from 'src/aws/aws.interface';
import { RoleEntity } from 'src/role/schema/role.schema';

@Schema({ timestamps: true, versionKey: false })
export class UserEntity {
    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
    })
    firstName: string;

    @Prop({
        required: false,
        index: true,
        lowercase: true,
        trim: true,
    })
    lastName?: string;

    @Prop({
        required: false,
        index: false,
        unique: false,
        trim: true,
    })
    mobileNumber?: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: RoleEntity.name,
    })
    role: Types.ObjectId;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        required: true,
    })
    passwordExpiration: Date;

    @Prop({
        required: true,
    })
    salt: string;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    picture?: IAwsS3Response;

    @Prop({
        required: false,
        type: Array,
        default: [],
        ref: ApiKeyEntity.name,
    })
    apiKey?: Types.ObjectId[];
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

// Hooks
UserSchema.pre<UserDocument>('save', function (next) {
    this.email = this.email.toLowerCase();
    this.firstName = this.firstName.toLowerCase();

    if (this.lastName) {
        this.lastName = this.lastName.toLowerCase();
    }
    next();
});
