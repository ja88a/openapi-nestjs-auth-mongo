export interface IAuthPassword {
    salt: string;
    passwordHash: string;
    passwordExpiration: Date;
}

export interface IAuthPayloadOptions {
    loginDate: Date;
}