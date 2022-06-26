export type IMessage = Record<string, string>;

export type IMessageOptionsProperties = Record<string, string>;
export interface IMessageOptions {
    readonly customLanguages?: string[];
    readonly properties?: IMessageOptionsProperties;
}

export type IMessageSetOptions = Omit<IMessageOptions, 'customLanguages'>;
