import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ENUM_PERMISSIONS,
    ENUM_PERMISSION_STATUS_CODE_ERROR,
} from 'src/permission/permission.constant';
import { AuthAdminJwtGuard } from 'src/auth/auth.decorator';
import { PermissionService } from 'src/permission/service/permission.service';
import { RoleService } from '../service/role.service';
import {
    GetRole,
    RoleDeleteGuard,
    RoleGetGuard,
    RoleUpdateActiveGuard,
    RoleUpdateGuard,
    RoleUpdateInactiveGuard,
} from '../role.decorator';
import { IRoleDocument } from '../role.interface';
import { ENUM_ROLE_STATUS_CODE_ERROR, ROLE_API_SWAGGER_TAG } from '../role.constant';
import {
    Response,
    ResponsePaging,
} from 'src/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/utils/response/response.interface';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { PaginationService } from 'src/pagination/service/pagination.service';
import { RoleDocument } from '../schema/role.schema';
import { PermissionDocument } from 'src/permission/schema/permission.schema';
import { RoleListDto } from '../dto/role.list.dto';
import { RoleCreateDto } from '../dto/role.create.dto';
import { RoleUpdateDto } from '../dto/role.update.dto';
import { RoleListSerialization } from '../serialization/role.list.serialization';
import { RoleRequestDto } from '../dto/role.request.dto';
import { RequestParamGuard } from 'src/utils/request/request.decorator';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { PAGINATION_DEFAULT_PAGE, PAGINATION_DEFAULT_PER_PAGE, PAGINATION_DEFAULT_SORT } from 'src/pagination/pagination.constant';
import { getSchemaResp, getSchemaRespGen } from 'src/utils/response/response.serialization';
import { RoleGetSerialization } from '../serialization/role.get.serialization';

@ApiTags(ROLE_API_SWAGGER_TAG)
@ApiBearerAuth()
@ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted', required: true, example: 'qwertyuiop12345zxcvbnmkjh:U2FsdGVkX1+jjNsr1IYqGeuQtwZR/pn1D2II4SvKhbyT9uvZND20Eldw4yetD1lLiHEIsP14O0o9HD68QSQX9HHXBuPCkarRBxukKnK0jUKLtIfbyJUvZDu8olEcmuY1LL7eo/4dmKPigWYxaXYzYx8Rp0r65ODX5uZwGZmKg/5IWYA/mFA2N1Op+zFurfA5XIgGeluXr0xpvpGmRSiJ+A=='})
@ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered', required: true, example: 1656450618419})
@ApiResponse({ status: HttpStatus.OK, description: 'Request successful.',
    schema: { "type": "object", "properties": { "statusCode": { "type": "integer" }, "message": { "type": "string" }, "data": { "type": "object"} } }
})
@ApiResponse({ status: HttpStatus.OK, description: 'Request successful.', schema: getSchemaRespGen({"type": "object", "additionalProperties": false, "title": "data output"})})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
@ApiExtraModels(RoleListSerialization)
@ApiExtraModels(RoleGetSerialization)
@Controller({
    version: '1',
    path: 'role',
})
export class RoleAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService
    ) {}

    /** 
     * Retrieve a list of available user roles 
     */
    @ResponsePaging('role.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ)
    @ErrorMeta(RoleAdminController.name, 'list')
    @Get('/list')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(RoleListSerialization, true)})
    @ApiQuery({name: 'page', description:'Page number', required: false, example: PAGINATION_DEFAULT_PAGE})
    @ApiQuery({name: 'perPage', description:'Number of entries per page', required: false, example: PAGINATION_DEFAULT_PER_PAGE}) 
    @ApiQuery({name: 'sort', description:'Expected results sorting', required: false, example: PAGINATION_DEFAULT_SORT })
    @ApiQuery({name: 'search', description:'Input for a text-based search', required: false}) 
    @ApiQuery({name: 'availableSort', description:'Available fields for sorting search results', required: false})
    @ApiQuery({name: 'availableSearch', description:'Data fields used for text-based searches', required: false}) 
    async list(
        @Query()
        {
            page,
            perPage,
            sort,
            search,
            availableSort,
            availableSearch,
        }: RoleListDto
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        if (search) {
            find['$or'] = [
                {
                    name: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                },
            ];
        }

        const roles: RoleDocument[] = await this.roleService.findAll(find, {
            skip: skip,
            limit: perPage,
            sort,
        });

        const totalData: number = await this.roleService.getTotal({});
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        const data: RoleListSerialization[] =
            await this.roleService.serializationList(roles);

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            availableSearch,
            availableSort,
            data,
        };
    }

    /** 
     * Retrieve the details of a given role
     */
    @Response('role.get')
    @RoleGetGuard()
    @RequestParamGuard(RoleRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ)
    @ErrorMeta(RoleAdminController.name, 'get')
    @Get('get/:role')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(RoleGetSerialization)})
    @ApiParam({name: 'role', description: 'Target role name', type: 'string'})
    async get(@GetRole() role: IRoleDocument): Promise<IResponse> {
        return this.roleService.serializationGet(role);
    }

    /**
     * Create a new user role, with associated API permission rights
     */
    @Response('role.create')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_CREATE)
    @ErrorMeta(RoleAdminController.name, 'create')
    @Post('/create')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "_id": { "type": "string", "description": "ID of the created role"}}})})
    async create(
        @Body()
        { name, permissions, isAdmin }: RoleCreateDto
    ): Promise<IResponse> {
        const exist: boolean = await this.roleService.exists(name);
        if (exist) {
            throw new BadRequestException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
                message: 'role.error.exist',
            });
        }

        for (const permission of permissions) {
            const checkPermission: PermissionDocument =
                await this.permissionService.findOneById(permission);

            if (!checkPermission) {
                throw new NotFoundException({
                    statusCode:
                        ENUM_PERMISSION_STATUS_CODE_ERROR.PERMISSION_NOT_FOUND_ERROR,
                    message: 'permission.error.notFound',
                });
            }
        }

        try {
            const create = await this.roleService.create({
                name,
                permissions,
                isAdmin,
            });

            return {
                _id: create._id,
            };
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    /** 
     * Change the details of a role
     */
    @Response('role.update')
    @RoleUpdateGuard()
    @RequestParamGuard(RoleRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_UPDATE)
    @ErrorMeta(RoleAdminController.name, 'update')
    @Put('/update/:role')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "_id": { "type": "string", "description": "ID of the updated role"}}})})
    @ApiParam({name: 'role', description: 'Target role name', type: 'string'})
    async update(
        @GetRole() role: RoleDocument,
        @Body()
        { name, permissions, isAdmin }: RoleUpdateDto
    ): Promise<IResponse> {
        const check: boolean = await this.roleService.exists(name, role._id);
        if (check) {
            throw new BadRequestException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
                message: 'role.error.exist',
            });
        }

        for (const permission of permissions) {
            const checkPermission: PermissionDocument =
                await this.permissionService.findOneById(permission);

            if (!checkPermission) {
                throw new NotFoundException({
                    statusCode:
                        ENUM_PERMISSION_STATUS_CODE_ERROR.PERMISSION_NOT_FOUND_ERROR,
                    message: 'permission.error.notFound',
                });
            }
        }

        try {
            await this.roleService.update(role._id, {
                name,
                permissions,
                isAdmin,
            });
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: role._id,
        };
    }

    /**
     * Remove a user role
     */
    @Response('role.delete')
    @RoleDeleteGuard()
    @RequestParamGuard(RoleRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_DELETE)
    @ErrorMeta(RoleAdminController.name, 'delete')
    @Delete('/delete/:role')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp()})
    @ApiParam({name: 'role', description: 'Target role name', type: 'string'})
    async delete(@GetRole() role: IRoleDocument): Promise<void> {
        try {
            await this.roleService.deleteOneById(role._id);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
        return;
    }

    /**
     * Set a role as inactive.
     * 
     * Pause its associated permissions.
     */
    @Response('role.inactive')
    @RoleUpdateInactiveGuard()
    @RequestParamGuard(RoleRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_UPDATE)
    @ErrorMeta(RoleAdminController.name, 'inactive')
    @Patch('/update/:role/inactive')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp()})
    @ApiParam({name: 'role', description: 'Target role name', type: 'string'})
    async inactive(@GetRole() role: IRoleDocument): Promise<void> {
        try {
            await this.roleService.inactive(role._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    /**
     * Set a role as active.
     * 
     * Resume the appliance of its associated permissions.
     */
    @Response('role.active')
    @RoleUpdateActiveGuard()
    @RequestParamGuard(RoleRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_UPDATE)
    @ErrorMeta(RoleAdminController.name, 'active')
    @Patch('/update/:role/active')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp()})
    @ApiParam({name: 'role', description: 'Target role name', type: 'string'})
    async active(@GetRole() role: IRoleDocument): Promise<void> {
        try {
            await this.roleService.active(role._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}
