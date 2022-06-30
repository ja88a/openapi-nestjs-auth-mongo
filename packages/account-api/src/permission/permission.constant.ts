export enum ENUM_PERMISSIONS {
    USER_CREATE = 'USER_CREATE',
    USER_UPDATE = 'USER_UPDATE',
    USER_READ = 'USER_READ',
    USER_DELETE = 'USER_DELETE',
    ROLE_CREATE = 'ROLE_CREATE',
    ROLE_UPDATE = 'ROLE_UPDATE',
    ROLE_READ = 'ROLE_READ',
    ROLE_DELETE = 'ROLE_DELETE',
    PERMISSION_READ = 'PERMISSION_READ',
    PERMISSION_UPDATE = 'PERMISSION_UPDATE',
    SETTING_READ = 'SETTING_READ',
    SETTING_UPDATE = 'SETTING_UPDATE',
}

export const PERMISSION_META_KEY = 'PermissionMetaKey';

export const PERMISSION_ACTIVE_META_KEY = 'PermissionActiveMetaKey';

export enum ENUM_PERMISSION_STATUS_CODE_ERROR {
    PERMISSION_NOT_FOUND_ERROR = 5200,
    PERMISSION_GUARD_INVALID_ERROR = 5201,
    PERMISSION_ACTIVE_ERROR = 5203,
}

export const PERMISSION_DEFAULT_SORT = 'name@asc';
export const PERMISSION_DEFAULT_PAGE = 1;
export const PERMISSION_DEFAULT_PER_PAGE = 10;
export const PERMISSION_DEFAULT_AVAILABLE_SORT = ['code', 'name', 'createdAt'];
export const PERMISSION_DEFAULT_AVAILABLE_SEARCH = ['code', 'name'];
export const PERMISSION_DEFAULT_ACTIVE = [true, false];

export const PERMISSION_API_SWAGGER_TAG = 'Permissions - admin'