import {
    Body,
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Patch,
    Put,
    Query,
} from '@nestjs/common';
import { ENUM_PERMISSIONS, PERMISSION_API_SWAGGER_TAG } from 'src/permission/permission.constant';
import { AuthAdminJwtGuard } from 'src/auth/auth.decorator';
import { PermissionService } from '../service/permission.service';
import {
    GetPermission,
    PermissionGetGuard,
    PermissionUpdateActiveGuard,
    PermissionUpdateGuard,
    PermissionUpdateInactiveGuard,
} from '../permission.decorator';
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
import { PermissionDocument } from '../schema/permission.schema';
import { PermissionListDto } from '../dto/permission.list.dto';
import { PermissionUpdateDto } from '../dto/permission.update.dto';
import { PermissionListSerialization } from '../serialization/permission.list.serialization';
import { RequestParamGuard } from 'src/utils/request/request.decorator';
import { PermissionRequestDto } from '../dto/permissions.request.dto';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { PAGINATION_DEFAULT_PAGE, PAGINATION_DEFAULT_PER_PAGE, PAGINATION_DEFAULT_SORT } from 'src/pagination/pagination.constant';
import { getSchemaResp, getSchemaRespGen } from 'src/utils/response/response.serialization';
import { PermissionGetSerialization } from '../serialization/permission.get.serialization';

@ApiTags(PERMISSION_API_SWAGGER_TAG)
@ApiBearerAuth()
@ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted', required: true, example: 'qwertyuiop12345zxcvbnmkjh:U2FsdGVkX1+jjNsr1IYqGeuQtwZR/pn1D2II4SvKhbyT9uvZND20Eldw4yetD1lLiHEIsP14O0o9HD68QSQX9HHXBuPCkarRBxukKnK0jUKLtIfbyJUvZDu8olEcmuY1LL7eo/4dmKPigWYxaXYzYx8Rp0r65ODX5uZwGZmKg/5IWYA/mFA2N1Op+zFurfA5XIgGeluXr0xpvpGmRSiJ+A==' })
@ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered', required: true, example: 1656450618419 })
@ApiResponse({ status: HttpStatus.OK, description: 'Request successful.', schema: getSchemaRespGen({ "type": "object" }) })
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
@ApiExtraModels(PermissionListSerialization)
@ApiExtraModels(PermissionGetSerialization)
@Controller({
    version: '1',
    path: 'permission',
})
export class PermissionAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly permissionService: PermissionService
    ) { }

    /** 
     * Retrieve a list of available permissions 
     */
    @ResponsePaging('permission.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.PERMISSION_READ)
    @ErrorMeta(PermissionAdminController.name, 'list')
    @Get('/list')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(PermissionListSerialization, true) })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, example: PAGINATION_DEFAULT_PAGE })
    @ApiQuery({ name: 'perPage', description: 'Number of entries per page', required: false, example: PAGINATION_DEFAULT_PER_PAGE })
    @ApiQuery({ name: 'sort', description: 'Expected results sorting', required: false, example: PAGINATION_DEFAULT_SORT })
    @ApiQuery({ name: 'search', description: 'Input for a text-based search', required: false })
    @ApiQuery({ name: 'availableSort', description: 'Available fields for sorting search results', required: false, type: 'string[]' })
    @ApiQuery({ name: 'availableSearch', description: 'Data fields used for text-based searches', required: false, type: 'string[]' })
    @ApiQuery({ name: 'isActive', description: 'Retrieve only active permissions or all', required: false, example: 'isActive', type: 'string[]' })
    async list(
        @Query()
        {
            page,
            perPage,
            sort,
            search,
            availableSort,
            availableSearch,
            isActive,
        }: PermissionListDto
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {
            isActive: {
                $in: isActive,
            },
        };
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

        const permissions: PermissionDocument[] =
            await this.permissionService.findAll(find, {
                skip: skip,
                limit: perPage,
                sort,
            });

        const totalData: number = await this.permissionService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        const data: PermissionListSerialization[] =
            await this.permissionService.serializationList(permissions);

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

    @Response('permission.get')
    @PermissionGetGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.PERMISSION_READ)
    @ErrorMeta(PermissionAdminController.name, 'get')
    @Get('/get/:permission')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(PermissionGetSerialization) })
    @ApiParam({ name: 'permission', description: 'Target permission code name', type: 'string', example: ENUM_PERMISSIONS.ROLE_CREATE })
    async get(
        @GetPermission() permission: PermissionDocument
    ): Promise<IResponse> {
        return this.permissionService.serializationGet(permission);
    }

    @Response('permission.update')
    @PermissionUpdateGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthAdminJwtGuard(
        ENUM_PERMISSIONS.PERMISSION_READ,
        ENUM_PERMISSIONS.PERMISSION_UPDATE
    )
    @ErrorMeta(PermissionAdminController.name, 'ErrorMeta')
    @Put('/update/:permission')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "_id": { "type": "string", "description": "ID of the created user" } } }) })
    @ApiParam({ name: 'permission', description: 'Target permission code name', type: 'string', example: ENUM_PERMISSIONS.ROLE_CREATE })
    async update(
        @GetPermission() permission: PermissionDocument,
        @Body() body: PermissionUpdateDto
    ): Promise<IResponse> {
        try {
            await this.permissionService.update(permission._id, body);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: permission._id,
        };
    }

    /** 
     * Disable a given permission.
     * 
     * Pause its usage / appliance.
     */
    @Response('permission.inactive')
    @PermissionUpdateInactiveGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthAdminJwtGuard(
        ENUM_PERMISSIONS.PERMISSION_READ,
        ENUM_PERMISSIONS.PERMISSION_UPDATE
    )
    @ErrorMeta(PermissionAdminController.name, 'inactive')
    @Patch('/update/:permission/inactive')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp() })
    @ApiParam({ name: 'permission', description: 'Target permission code name', type: 'string', example: ENUM_PERMISSIONS.ROLE_CREATE })
    async inactive(
        @GetPermission() permission: PermissionDocument
    ): Promise<void> {
        try {
            await this.permissionService.inactive(permission._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    /** 
     * Activate a given permission.
     * 
     * Resume its appliance.
     */
    @Response('permission.active')
    @PermissionUpdateActiveGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthAdminJwtGuard(
        ENUM_PERMISSIONS.PERMISSION_READ,
        ENUM_PERMISSIONS.PERMISSION_UPDATE
    )
    @ErrorMeta(PermissionAdminController.name, 'active')
    @Patch('/update/:permission/active')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp() })
    @ApiParam({ name: 'permission', description: 'Target permission code name', type: 'string', example: ENUM_PERMISSIONS.ROLE_CREATE })
    async active(
        @GetPermission() permission: PermissionDocument
    ): Promise<void> {
        try {
            await this.permissionService.active(permission._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}
