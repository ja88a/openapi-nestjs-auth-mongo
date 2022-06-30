import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsMongoId,
    IsBoolean,
} from 'class-validator';

export class RoleCreateDto {
    /** Role name */
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @Type(() => String)
    readonly name: string;

    /** Permissions to be associated */
    @IsMongoId({ each: true })
    @IsNotEmpty()
    readonly permissions: string[];

    /** Set the role to be usable by admins only */
    @IsBoolean()
    @IsNotEmpty()
    readonly isAdmin: boolean;
}
