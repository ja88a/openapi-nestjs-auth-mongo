import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Put,
    Query,
    InternalServerErrorException,
    BadRequestException,
    Patch,
    NotFoundException,
    HttpStatus,
} from '@nestjs/common';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import {
    GetUser,
    UserDeleteGuard,
    UserGetGuard,
    UserUpdateActiveGuard,
    UserUpdateGuard,
    UserUpdateInactiveGuard,
} from '../user.decorator';
import { AuthAdminJwtGuard } from 'src/auth/auth.decorator';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/role/role.constant';
import { UserService } from '../service/user.service';
import { RoleService } from 'src/role/service/role.service';
import { IUserCheckExist, IUserDocument } from '../user.interface';
import { ENUM_USER_STATUS_CODE_ERROR, USER_API_SWAGGER_TAG } from '../user.constant';
import { PaginationService } from 'src/pagination/service/pagination.service';
import { AuthService } from 'src/auth/service/auth.service';
import {
    Response,
    ResponsePaging,
} from 'src/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/utils/response/response.interface';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { UserListDto } from '../dto/user.list.dto';
import { UserListSerialization } from '../serialization/user.list.serialization';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserUpdateDto } from '../dto/user.update.dto';
import { RequestParamGuard } from 'src/utils/request/request.decorator';
import { UserRequestDto } from '../dto/user.request.dto';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { PAGINATION_DEFAULT_PAGE, PAGINATION_DEFAULT_PER_PAGE, PAGINATION_DEFAULT_SORT } from 'src/pagination/pagination.constant';
import { getSchemaResp, getSchemaRespGen } from 'src/utils/response/response.serialization';
import { UserGetSerialization } from '../serialization/user.get.serialization';
import { Logger } from 'src/logger/logger.decorator';
import { ENUM_LOGGER_ACTION } from 'src/logger/logger.constant';

@ApiTags(USER_API_SWAGGER_TAG)
@ApiBearerAuth()
@ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted', required: true, example: 'qwertyuiop12345zxcvbnmkjh:U2FsdGVkX1+jjNsr1IYqGeuQtwZR/pn1D2II4SvKhbyT9uvZND20Eldw4yetD1lLiHEIsP14O0o9HD68QSQX9HHXBuPCkarRBxukKnK0jUKLtIfbyJUvZDu8olEcmuY1LL7eo/4dmKPigWYxaXYzYx8Rp0r65ODX5uZwGZmKg/5IWYA/mFA2N1Op+zFurfA5XIgGeluXr0xpvpGmRSiJ+A==' })
@ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered', required: true, example: 1656450618419 })
@ApiResponse({ status: HttpStatus.OK, description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "additionalProperties": false, "title": "data output" }) })
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
@ApiExtraModels(UserListSerialization)
@ApiExtraModels(UserGetSerialization)
@Controller({
    version: '1',
    path: 'user',
})
export class UserAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService,
        private readonly roleService: RoleService
    ) { }

    /**
     * Retrieve a list of all users
     */
    @ResponsePaging('user.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @Logger(ENUM_LOGGER_ACTION.USER_LIST, { tags: ['user', 'list'] })
    @ErrorMeta(UserAdminController.name, 'list')
    @Get('/list')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(UserListSerialization, true) })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, example: PAGINATION_DEFAULT_PAGE })
    @ApiQuery({ name: 'perPage', description: 'Number of entries per page', required: false, example: PAGINATION_DEFAULT_PER_PAGE })
    @ApiQuery({ name: 'sort', description: 'Expected results sorting', required: false, example: PAGINATION_DEFAULT_SORT })
    @ApiQuery({ name: 'search', description: 'Input for a text-based search', required: false })
    @ApiQuery({ name: 'availableSort', description: 'Available fields for sorting search results', required: false })
    @ApiQuery({ name: 'availableSearch', description: 'Data fields used for text-based searches', required: false })
    async list(
        @Query()
        {
            page,
            perPage,
            sort,
            search,
            availableSort,
            availableSearch,
        }: UserListDto
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};

        if (search) {
            find['$or'] = [
                {
                    firstName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    lastName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    email: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    mobileNumber: search,
                },
            ];
        }
        const users: IUserDocument[] = await this.userService.findAll(find, {
            limit: perPage,
            skip: skip,
            sort,
        });
        const totalData: number = await this.userService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        const data: UserListSerialization[] =
            await this.userService.serializationList(users);

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
     * Retrieve the details of a given user
     */
    @Response('user.get')
    @UserGetGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @Logger(ENUM_LOGGER_ACTION.USER_GET, { tags: ['user', 'get'] })
    @ErrorMeta(UserAdminController.name, 'get')
    @Get('get/:user')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(UserGetSerialization) })
    @ApiParam({ name: 'user', description: 'Target user ID', type: 'string' })
    async get(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationGet(user);
    }

    /**
     * Create a new user.
     */
    @Response('user.create')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_CREATE)
    @Logger(ENUM_LOGGER_ACTION.USER_CREATE, { tags: ['user', 'create'] })
    @ErrorMeta(UserAdminController.name, 'create')
    @Post('/create')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "_id": { "type": "string", "description": "ID of the created user" } } }) })
    async create(
        @Body()
        body: UserCreateDto
    ): Promise<IResponse> {
        const checkExist: IUserCheckExist = await this.userService.checkExist(
            body.email,
            body.mobileNumber
        );

        if (checkExist.email && checkExist.mobileNumber) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
                message: 'user.error.exist',
            });
        } else if (checkExist.email) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        } else if (checkExist.mobileNumber) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
                message: 'user.error.mobileNumberExist',
            });
        }

        const role = await this.roleService.findOneById(body.role);
        if (!role) {
            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            });
        }

        try {
            const password = await this.authService.createPassword(
                body.password
            );

            const create = await this.userService.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                mobileNumber: body.mobileNumber,
                role: body.role,
                password: password.passwordHash,
                passwordExpiration: password.passwordExpiration,
                salt: password.salt,
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
     * Remove an existing user.
     */
    @Response('user.delete')
    @UserDeleteGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_DELETE)
    @Logger(ENUM_LOGGER_ACTION.USER_DELETE, { tags: ['user', 'delete'] })
    @ErrorMeta(UserAdminController.name, 'delete')
    @Delete('/delete/:user')
    @ApiParam({ name: 'user', description: 'Target user ID', type: 'string' })
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp() })
    async delete(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.deleteOneById(user._id);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    /**
     * Update the details of a given user.
     */
    @Response('user.update')
    @UserUpdateGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
    @Logger(ENUM_LOGGER_ACTION.USER_UPDATE, { tags: ['user', 'update'] })
    @ErrorMeta(UserAdminController.name, 'update')
    @Put('/update/:user')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "_id": { "type": "string", "description": "ID of the updated user" } } }) })
    @ApiParam({ name: 'user', description: 'Target user ID', type: 'string' })
    async update(
        @GetUser() user: IUserDocument,
        @Body()
        body: UserUpdateDto
    ): Promise<IResponse> {
        try {
            await this.userService.updateOneById(user._id, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: user._id,
        };
    }

    /**
     * De-activate a given user account, set it as inactive.
     * 
     * Pause its API accesses.
     */
    @Response('user.inactive')
    @UserUpdateInactiveGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
    @Logger(ENUM_LOGGER_ACTION.USER_SET_INACTIVE, { tags: ['user', 'setInactive'] })
    @ErrorMeta(UserAdminController.name, 'inactive')
    @Patch('/update/:user/inactive')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp() })
    @ApiParam({ name: 'user', description: 'Target user ID', type: 'string' })
    async inactive(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.inactive(user._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    /**
     * Activate a user account, set it as active.
     * 
     * Resume the user access to APIs.
     */
    @Response('user.active')
    @UserUpdateActiveGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
    @Logger(ENUM_LOGGER_ACTION.USER_SET_ACTIVE, { tags: ['user', 'setActive'] })
    @ErrorMeta(UserAdminController.name, 'active')
    @Patch('/update/:user/active')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp() })
    @ApiParam({ name: 'user', description: 'Target user ID', type: 'string' })
    async active(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.active(user._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}
