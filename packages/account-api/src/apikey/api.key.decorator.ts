import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
} from '@nestjs/common';
import { AUTH_EXCLUDE_API_KEY_META_KEY } from 'src/apikey/api.key.constant'
import { RequestExcludeTimestamp } from 'src/utils/request/request.decorator';

export const AuthExcludeApiKeyHeader = () =>
    SetMetadata(AUTH_EXCLUDE_API_KEY_META_KEY, true);

export function AuthExcludeApiKey(): any {
    return applyDecorators(
        SetMetadata(AUTH_EXCLUDE_API_KEY_META_KEY, true),
        RequestExcludeTimestamp()
    );
}

export const ApiKey = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { apiKey } = ctx.switchToHttp().getRequest();
        return data ? apiKey[data] : apiKey;
    }
);

