import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    MinLength,
    IsOptional,
    ValidateIf,
} from 'class-validator';
import { IsPasswordStrong } from 'src/utils/request/validation/request.is-password-strong.validation';
import { IsStartWith } from 'src/utils/request/validation/request.is-start-with.validation';

/** 
 * Payload of a sign up request
 */
export class AuthSignUpDto {
    /** Unique user email */
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly email: string;

    /** User first name */
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly firstName: string;

    /** User last name */
    @IsString()
    @IsOptional()
    @ValidateIf((e) => e.lastName !== '')
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly lastName?: string;

    /** Optional user phone number name */
    @IsString()
    @IsOptional() 
    //@IsNotEmpty()
    @MinLength(10)
    @MaxLength(14)
    @Type(() => String)
    @IsStartWith(['+'])
    readonly mobileNumber?: string;

    /** User authentication password */
    @IsNotEmpty()
    @IsPasswordStrong()
    @MinLength(8)
    @MaxLength(200)
    readonly password: string;
}
