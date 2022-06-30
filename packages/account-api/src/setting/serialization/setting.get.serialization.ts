import { Type } from 'class-transformer';

export class SettingGetSerialization {
    /** Unique identifier */
    @Type(() => String)
    readonly _id: string;

    /** Setting name */
    readonly name: string;
    /** Setting optional description */
    readonly description?: string;
    /** Setting value */
    readonly value: string | number | boolean;
    /** Setting creation date */
    readonly createdAt: Date;
    /** Setting last modification date */
    readonly updatedAt: Date;
}
