import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { PermissionDocument } from 'src/permission/schema/permission.schema';

export class RoleGetSerialization {
    /** Role unique identifier */
    @Type(() => String)
    readonly _id: string;

    /** Role activation toggle */
    readonly isActive: boolean;
    /** Role name */
    readonly name: string;
    /** Flag a role dedicated to admins only */
    readonly isAdmin: boolean;

    /** Permissions assocated to the role */
    @Transform(({ obj }) =>
        obj.permissions.map((val) => ({
            _id: `${val._id}`,
            code: val.code,
            name: val.name,
            isActive: val.isActive,
        }))
    )
    readonly permissions: PermissionDocument[];

    /** Role creation time */
    readonly createdAt: Date;

    /** Role last modification time */
    @Exclude()
    @ApiHideProperty()
    readonly updatedAt: Date;
}
