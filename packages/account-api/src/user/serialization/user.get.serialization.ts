import { ApiHideProperty } from '@nestjs/swagger/dist/decorators/api-hide-property.decorator';
import { Exclude, Transform, Type } from 'class-transformer';
import { IAuthApiDocument } from 'src/apikey/auth.api.interface';
import { IAwsS3Response } from 'src/aws/aws.interface';
import { IRoleDocument } from 'src/role/role.interface';

export class UserGetSerialization {
    /** Unique user ID */
    @Type(() => String)
    readonly _id: string;

    /** User role */
    @Transform(({ value }) => ({
        name: value.name,
        permissions: value.permissions.map((val: Record<string, any>) => ({
            name: val.name,
            isActive: val.isActive,
        })),
        isActive: value.isActive,
    }))
    readonly role: IRoleDocument;

    /** Email address */
    readonly email: string;
    /** International phone number */
    readonly mobileNumber?: string;
    /** Account status */
    readonly isActive: boolean;
    /** First name */
    readonly firstName: string;
    /** Last name */
    readonly lastName?: string;
    /** Profile picture */
    readonly photo?: IAwsS3Response;

    /** API Access keys */
    readonly apikey?: IAuthApiDocument[];

    /** Authentication password [hash] */
    @Exclude()
    @ApiHideProperty() 
    readonly password: string;

    /** Password expiration time */
    readonly passwordExpired: Date;

    /** Password salt */
    @Exclude()
    @ApiHideProperty() 
    readonly salt: string;

    /** Account creation date */
    readonly createdAt: Date;

    /** Account last modification date */
    @Exclude()
    readonly updatedAt: Date;
}
