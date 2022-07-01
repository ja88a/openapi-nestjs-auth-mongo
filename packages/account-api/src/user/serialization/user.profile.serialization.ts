import { ApiHideProperty } from '@nestjs/swagger/dist/decorators';
import { Exclude, Transform, Type } from 'class-transformer';
import { IAuthApiDocument } from 'src/apikey/auth.api.interface';
import { IAwsS3Response } from 'src/aws/aws.interface';
import { IRoleDocument } from 'src/role/role.interface';

export class UserProfileSerialization {
    /** User unique identifier */
    @Type(() => String)
    readonly _id: string;

    /** User role(s) and permissions */
    @Transform(({ value }) => ({
        name: value.name,
        permissions: value.permissions.map((val: Record<string, any>) => ({
            name: val.name,
            isActive: val.isActive,
        })),
        isActive: value.isActive,
    }))
    readonly role: IRoleDocument;

    /** User first name */
    readonly firstName: string;
    /** User last name */
    readonly lastName?: string;
    /** User email */
    readonly email: string;
    /** User mobile phone number */
    readonly mobileNumber?: string;
    /** User profile picture */
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
    readonly passwordExpired: Date;

    /** User password's hashing salt */
    @Exclude()
    @ApiHideProperty() 
    readonly salt: string;

    /** User account creation time */
    @Exclude()
    @ApiHideProperty() 
    readonly createdAt: Date;

    /** Last modification time of the user account */
    @Exclude()
    @ApiHideProperty() 
    readonly updatedAt: Date;
}
