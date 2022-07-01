import { ApiHideProperty } from '@nestjs/swagger/dist/decorators';
import { Exclude, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { IAuthApiDocument } from 'src/apikey/auth.api.interface';
import { IAwsS3Response } from 'src/aws/aws.interface';

export class UserListSerialization {
    /** User unique identifier */
    @Type(() => String)
    readonly _id: string;

    /** User role(s) */
    @Exclude()
    readonly role: Types.ObjectId;

    /** User email address */
    readonly email: string;
    /** User mobile phone number */
    readonly mobileNumber?: string;

    /** User account active status */
    readonly isActive: boolean;

    /** User first name */
    readonly firstName: string;
    /** User last name */
    readonly lastName?: string;

    /** User profile picture */
    @Exclude()
    @ApiHideProperty()
    readonly photo?: IAwsS3Response;

    /** API Access keys */
    @Exclude()
    @ApiHideProperty()
    readonly apikey?: IAuthApiDocument[];
    
    /** User password (hash) */
    @Exclude()
    @ApiHideProperty()
    readonly password: string;

    /** User password expiration time */
    @Exclude()
    @ApiHideProperty()
    readonly passwordExpired: Date;

    /** User password's hashing salt */
    @Exclude()
    @ApiHideProperty()
    readonly salt: string;

    /** User account creation time */
    readonly createdAt: Date;

    /** Last modification time of the user account */
    @Exclude()
    @ApiHideProperty()
    readonly updatedAt: Date;
}
