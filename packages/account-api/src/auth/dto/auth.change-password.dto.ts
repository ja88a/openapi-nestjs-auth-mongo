import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsPasswordStrong } from 'src/utils/request/validation/request.is-password-strong.validation';

/** Payload for requesting the replacement of actual user password */
export class AuthChangePasswordDto {

    /** Actual user password */
    @IsString()
    @IsNotEmpty()
    readonly oldPassword: string;

    /** New password */
    @IsString()
    @IsNotEmpty()
    @IsPasswordStrong()
    @MinLength(8)
    @MaxLength(200) 
    readonly newPassword: string;
}
