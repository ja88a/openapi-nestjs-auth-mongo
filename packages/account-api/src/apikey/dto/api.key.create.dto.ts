import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateIf,
} from 'class-validator';

/**
 * Authentication API Key creation data
 */
export class ApiKeyCreateDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsOptional()
    @ValidateIf((e) => e.description !== '')
    @IsString()
    @MaxLength(100)
    description?: string;
}
