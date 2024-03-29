import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthExcludeApiKey } from 'src/apikey/api.key.decorator';
import { AUTH_API_SWAGGER_TAG } from 'src/auth/auth.constant';
import { AuthSignUpDto } from 'src/auth/dto/auth.sign-up.dto';
import { AuthLoginSerialization } from 'src/auth/serialization/auth.login.serialization';
import { AuthService } from 'src/auth/service/auth.service';
import { ENUM_LOGGER_ACTION } from 'src/logger/logger.constant';
import { Logger } from 'src/logger/logger.decorator';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/role/role.constant';
import { RoleDocument } from 'src/role/schema/role.schema';
import { RoleService } from 'src/role/service/role.service';
import { UserService } from 'src/user/service/user.service';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/user/user.constant';
import { IUserCheckExist, IUserDocument } from 'src/user/user.interface';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { Response } from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { getSchemaRespGen, getSchemaResp } from 'src/utils/response/response.serialization';

@ApiTags(AUTH_API_SWAGGER_TAG) 
//@ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted', required: true, example: 'qwertyuiop12345zxcvbnmkjh:U2FsdGVkX1+jjNsr1IYqGeuQtwZR/pn1D2II4SvKhbyT9uvZND20Eldw4yetD1lLiHEIsP14O0o9HD68QSQX9HHXBuPCkarRBxukKnK0jUKLtIfbyJUvZDu8olEcmuY1LL7eo/4dmKPigWYxaXYzYx8Rp0r65ODX5uZwGZmKg/5IWYA/mFA2N1Op+zFurfA5XIgGeluXr0xpvpGmRSiJ+A=='})
//@ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered', required: true, example: 1656450618419})
@ApiResponse({ status: HttpStatus.OK, description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "additionalProperties": false, "title": "data output" }) })
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
@Controller({
    version: '1',
    path: '/auth',
})
export class AuthPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly roleService: RoleService
    ) {}

    /**
     * Register a new user account by signing up with an email.
     */
    @Response('auth.signUp')
    @Logger(ENUM_LOGGER_ACTION.SIGNUP, { tags: ['signup', 'withEmail'] })
    @AuthExcludeApiKey()
    @ErrorMeta(AuthPublicController.name, 'signUp')
    @Post('/sign-up')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "accessToken": { "type": "string", "description": "Access token" },  "refreshToken": { "type": "string", "description": "Refresh token" }} }) })
    async signUp(
        @Body()
        { email, mobileNumber, ...body }: AuthSignUpDto
    ): Promise<IResponse> {
        const role: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                name: 'user',
            }
        );
        if (!role) {
            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            });
        }

        const checkExist: IUserCheckExist = await this.userService.checkExist(
            email,
            mobileNumber
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

        try {
            const password = await this.authService.createPassword(
                body.password
            );

            const create = await this.userService.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email,
                mobileNumber,
                role: role._id,
                password: password.passwordHash,
                passwordExpiration: password.passwordExpiration,
                salt: password.salt,
            });

            const user: IUserDocument =
                await this.userService.findOneById<IUserDocument>(create._id, {
                    populate: {
                        role: true,
                        permission: true,
                    },
                });
            const safe: AuthLoginSerialization =
                await this.authService.serializationLogin(user);

            const payloadAccessToken: Record<string, any> =
                await this.authService.createPayloadAccessToken(safe, false);
            const payloadRefreshToken: Record<string, any> =
                await this.authService.createPayloadRefreshToken(safe, false, {
                    loginDate: payloadAccessToken.loginDate,
                });

            const accessToken: string =
                await this.authService.createAccessToken(payloadAccessToken);

            const refreshToken: string =
                await this.authService.createRefreshToken(
                    payloadRefreshToken,
                    false
                );

            return {
                accessToken,
                refreshToken,
            };
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }
}
