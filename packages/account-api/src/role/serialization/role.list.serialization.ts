import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';

export class RoleListSerialization {
    /** Role unique identifier */
    @Type(() => String)
    readonly _id: string;

    /** Active status */
    readonly isActive: boolean;
    /** Role name */
    readonly name: string;
    /** Admin role flag */
    readonly isAdmin: boolean;

    /** Number of associated permissions */
    @Exclude()
    @ApiHideProperty() 
    readonly permissions: number;

    /** Role creation date */
    readonly createdAt: Date;

    /** Role last modification date */
    @Exclude()
    @ApiHideProperty() 
    readonly updatedAt: Date;
}
