import { Type } from 'class-transformer';

export class ApiKeyListSerialization {
    @Type(() => String)
    readonly _id: string;

    readonly name: string;
    readonly key: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
}
