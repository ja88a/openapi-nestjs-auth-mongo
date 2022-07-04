import { Request } from 'express';
import { IApiKeyAuthPayload } from 'src/apikey/api.key.interface';
import { IResult } from 'ua-parser-js';

export interface IRequestApp extends Request {
    userAgent?: IResult;
    id?: string;
    timezone: string;
    timestamp: string;
    customLang: string;
    apiKey?: IApiKeyAuthPayload;
    user?: Record<string, any>;
    version?: string;
}
