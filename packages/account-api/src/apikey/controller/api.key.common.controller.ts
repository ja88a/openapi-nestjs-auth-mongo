import { Controller } from "@nestjs/common/decorators/core";
import { Get } from "@nestjs/common/decorators/http";
import { HttpStatus } from "@nestjs/common/enums";
import { ApiExtraModels, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger/dist/decorators";
import { APIKEY_TOKEN_API_SWAGGER_TAG } from "src/apikey/api.key.constant";
import { ApiKeyDocument } from "src/apikey/schema/api.key.schema";
import { ApiKeyListSerialization } from "src/apikey/serialization/api.key.list.serialization";
import { ApiKeyService } from "src/apikey/service/api.key.service";
import { AuthJwtGuard, AuthAdminJwtGuard } from "src/auth/auth.decorator";
import { ENUM_PERMISSIONS } from "src/permission/permission.constant";
import { UserService } from "src/user/service/user.service";
import { GetUser } from "src/user/user.decorator";
import { IUserDocument } from "src/user/user.interface";
import { ErrorMeta } from "src/utils/error/error.decorator";
import { IResponse } from "src/utils/response/response.interface";
import { getSchemaResp } from "src/utils/response/response.serialization";

/**
 * Controller of the common Account Authentication requests
 */
@ApiTags(APIKEY_TOKEN_API_SWAGGER_TAG)
@ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted', required: true, example: 'qwertyuiop12345zxcvbnmkjh:U2FsdGVkX1+jjNsr1IYqGeuQtwZR/pn1D2II4SvKhbyT9uvZND20Eldw4yetD1lLiHEIsP14O0o9HD68QSQX9HHXBuPCkarRBxukKnK0jUKLtIfbyJUvZDu8olEcmuY1LL7eo/4dmKPigWYxaXYzYx8Rp0r65ODX5uZwGZmKg/5IWYA/mFA2N1Op+zFurfA5XIgGeluXr0xpvpGmRSiJ+A==' })
@ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered', required: true, example: 1656450618419 })
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
@ApiExtraModels(ApiKeyListSerialization)
@Controller({
    version: '1',
    path: '/apikey',
})
export class ApiKeyCommonController {
    constructor(
        private readonly userService: UserService,
        private readonly authApiService: ApiKeyService
    ) { }

    /** 
     * Retrieve a list of private API Keys for the current user
     */
    @AuthJwtGuard()
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.APIKEY_READ)
    @ErrorMeta(ApiKeyCommonController.name, 'list')
    @Get('/list')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(ApiKeyListSerialization, true) })
    async list(
        @GetUser() user: IUserDocument
    ): Promise<IResponse> {

        const apiKeys: ApiKeyDocument[] = await this.authApiService.findAll();

        const data: ApiKeyListSerialization[] =
            await this.authApiService.serializationList(apiKeys);

        return {
            data,
        };
    }

}
