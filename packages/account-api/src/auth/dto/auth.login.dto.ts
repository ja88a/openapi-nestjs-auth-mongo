import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsEmail,
    MaxLength,
    IsBoolean,
    IsOptional,
    ValidateIf,
    IsString,
} from 'class-validator';

/** 
 * Payload of an authentication request 
 */
export class AuthLoginDto {
    /** User email, used as unique ID */
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    readonly email: string;

    /** Persistence toggle */
    @IsOptional()
    @IsBoolean()
    @ValidateIf((e) => e.rememberMe !== '')
    readonly rememberMe?: boolean;

    /** Password */
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly password: string;
}
