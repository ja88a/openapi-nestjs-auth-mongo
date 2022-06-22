import { RotatingFileStream } from 'rotating-file-stream';
import { Response } from 'express';

export interface IHttpDebuggerConfigOptions {
    readonly stream: RotatingFileStream;
}

export interface IHttpDebuggerConfig {
    readonly debuggerHttpFormat: string;
    readonly HttpDebuggerOptions: IHttpDebuggerConfigOptions;
}

export interface ICustomResponse extends Response {
    body: string;
}
