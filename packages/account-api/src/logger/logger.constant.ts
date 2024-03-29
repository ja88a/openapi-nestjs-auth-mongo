export enum ENUM_LOGGER_LEVEL {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARM = 'WARM',
    FATAL = 'FATAL',
}

export enum ENUM_LOGGER_ACTION {
    SIGNUP = 'SIGN UP',
    LOGIN = 'LOGIN',

    TEST = 'TEST',
    TEST_TIMEOUT = 'TEST TIME OUT',

    TOKEN_REFRESH = 'REFRESH TOKEN',
    PASSWORD_CHANGE = 'CHANGE PASSWORD',

    PROFILE_GET = 'GET USER PROFILE',
    PROFILE_UPLOAD_PICTURE = 'UPLOAD PROFILE PICTURE',

    USER_GET = 'GET USER INFO',
    USER_LIST = 'LIST USERS',
    USER_SET_ACTIVE = 'SET USER AS ACTIVE',
    USER_SET_INACTIVE = 'SET USER AS INACTIVE',
    USER_CREATE = 'CREATE NEW USER',
    USER_UPDATE = 'UPDATE USER INFO',
    USER_DELETE = 'DELETE USER',
}
