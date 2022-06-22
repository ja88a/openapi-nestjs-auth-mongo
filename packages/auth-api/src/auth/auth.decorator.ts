import {
    UseGuards,
    createParamDecorator,
    ExecutionContext,
    applyDecorators,
    SetMetadata,
} from '@nestjs/common';
import { PermissionPayloadDefaultGuard } from 'src/permission/guard/payload/permission.default.guard';
import {
    ENUM_PERMISSIONS,
    PERMISSION_META_KEY,
} from 'src/permission/permission.constant';
import {
    AUTH_ADMIN_META_KEY,
    AUTH_EXCLUDE_API_KEY_META_KEY,
} from './auth.constant';
import { BasicGuard } from './guard/basic/auth.basic.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh/auth.jwt-refresh.guard';
import { JwtGuard } from './guard/jwt/auth.jwt.guard';
import { AuthPayloadAdminGuard } from './guard/payload/auth.payload.admin.guard';
import { AuthPayloadDefaultGuard } from './guard/payload/auth.payload.default.guard';
import { AuthPayloadPasswordExpiredGuard } from './guard/payload/auth.payload.password-expired.guard';

export function AuthJwtGuard(...permissions: ENUM_PERMISSIONS[]): any {
    return applyDecorators(
        UseGuards(
            JwtGuard,
            AuthPayloadDefaultGuard,
            PermissionPayloadDefaultGuard
        ),
        SetMetadata(PERMISSION_META_KEY, permissions)
    );
}

export function AuthPublicJwtGuard(...permissions: ENUM_PERMISSIONS[]): any {
    return applyDecorators(
        UseGuards(
            JwtGuard,
            AuthPayloadDefaultGuard,
            AuthPayloadPasswordExpiredGuard,
            AuthPayloadAdminGuard,
            PermissionPayloadDefaultGuard
        ),
        SetMetadata(PERMISSION_META_KEY, permissions),
        SetMetadata(AUTH_ADMIN_META_KEY, [false])
    );
}

export function AuthAdminJwtGuard(...permissions: ENUM_PERMISSIONS[]) {
    return applyDecorators(
        UseGuards(
            JwtGuard,
            AuthPayloadDefaultGuard,
            AuthPayloadPasswordExpiredGuard,
            AuthPayloadAdminGuard,
            PermissionPayloadDefaultGuard
        ),
        SetMetadata(PERMISSION_META_KEY, permissions),
        SetMetadata(AUTH_ADMIN_META_KEY, [true])
    );
}

export function AuthRefreshJwtGuard(): any {
    return applyDecorators(UseGuards(JwtRefreshGuard));
}

export function AuthBasicGuard(): any {
    return applyDecorators(UseGuards(BasicGuard));
}

export const AuthExcludeApiKey = () =>
    SetMetadata(AUTH_EXCLUDE_API_KEY_META_KEY, true);

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { user } = ctx.switchToHttp().getRequest();
        return data ? user[data] : user;
    }
);

export const ApiKey = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { apiKey } = ctx.switchToHttp().getRequest();
        return data ? apiKey[data] : apiKey;
    }
);

export const Token = createParamDecorator(
    (data: string, ctx: ExecutionContext): string => {
        const { headers } = ctx.switchToHttp().getRequest();
        const { authorization } = headers;
        return authorization ? authorization.split(' ')[1] : undefined;
    }
);
