import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
} from '@nestjs/common';
import { AUTH_EXCLUDE_API_KEY_META_KEY } from 'src/apikey/auth.api.constant'

export const AuthExcludeApiKey = () =>
    SetMetadata(AUTH_EXCLUDE_API_KEY_META_KEY, true);

export const ApiKey = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { apiKey } = ctx.switchToHttp().getRequest();
        return data ? apiKey[data] : apiKey;
    }
);

