import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    Patch,
} from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/user/user.constant';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/role/role.constant';
import { UserService } from 'src/user/service/user.service';
import { AuthService } from '../service/auth.service';
import {
    AUTH_API_SWAGGER_TAG,
    ENUM_AUTH_STATUS_CODE_ERROR,
    ENUM_AUTH_STATUS_CODE_SUCCESS,
} from '../auth.constant';
import { Response } from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { IUserDocument } from 'src/user/user.interface';
import { ENUM_LOGGER_ACTION } from 'src/logger/logger.constant';
import {
    AuthJwtGuard,
    AuthRefreshJwtGuard,
    Token,
    User,
} from '../auth.decorator';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { UserDocument } from 'src/user/schema/user.schema';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthChangePasswordDto } from '../dto/auth.change-password.dto';
import { AuthLoginSerialization } from '../serialization/auth.login.serialization';
import { SuccessException } from 'src/utils/error/exception/error.success.exception';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { Logger } from 'src/logger/logger.decorator';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators'
import { getSchemaResp, getSchemaRespGen } from 'src/utils/response/response.serialization';

/**
 * Controller of the common Account Authentication requests
 */
@ApiTags(AUTH_API_SWAGGER_TAG)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
//@ApiExtraModels(AuthLoginSerialization)
@Controller({
    version: '1',
    path: '/auth',
})
export class AuthCommonController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    /**
     * User login based on its credentials: email & password
     */
    @Response('auth.login', {
        statusCode: ENUM_AUTH_STATUS_CODE_SUCCESS.AUTH_LOGIN_SUCCESS,
    })
    @Logger(ENUM_LOGGER_ACTION.LOGIN, { tags: ['login', 'withEmail'] })
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(AuthCommonController.name, 'login')
    @Post('/login')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "accessToken": { "type": "string", "description": "Access token" },  "refreshToken": { "type": "string", "description": "Refresh token" }} }) })
    async login(@Body() body: AuthLoginDto): Promise<IResponse> {
        const rememberMe: boolean = body.rememberMe ? true : false;
        const user: IUserDocument =
            await this.userService.findOne<IUserDocument>(
                {
                    email: body.email,
                },
                {
                    populate: {
                        role: true,
                        permission: true,
                    },
                }
            );

        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        const validate: boolean = await this.authService.validateUser(
            body.password,
            user.password
        );

        if (!validate) {
            throw new BadRequestException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NOT_MATCH_ERROR,
                message: 'auth.error.passwordNotMatch',
            });
        } else if (!user.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        } else if (!user.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }

        const safe: AuthLoginSerialization =
            await this.authService.serializationLogin(user);

        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(safe, rememberMe);
        const payloadRefreshToken: Record<string, any> =
            await this.authService.createPayloadRefreshToken(safe, rememberMe, {
                loginDate: payloadAccessToken.loginDate,
            });

        const accessToken: string = await this.authService.createAccessToken(
            payloadAccessToken
        );

        const refreshToken: string = await this.authService.createRefreshToken(
            payloadRefreshToken,
            rememberMe
        );

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(user.passwordExpired);

        if (checkPasswordExpired) {
            throw new SuccessException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_EXPIRED_ERROR,
                message: 'auth.error.passwordExpired',
                data: {
                    accessToken,
                    refreshToken,
                },
            });
        }

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refresh actual authentication token
     * The request authorization bearer value must be set to ``refreshToken``
     *  
     * @example {"statusCode": 1001, "message": "Login success.", "data": {"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI4ODYyM2U2NDQ3MWI2NDRiYTc5M2MiLCJtb2JpbGVOdW1iZXIiOiI2MjgxMjMxMjExMTEiLCJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJyb2xlIjp7Im5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOltdLCJpc0FjdGl2ZSI6dHJ1ZSwiaXNBZG1pbiI6ZmFsc2V9LCJwYXNzd29yZEV4cGlyZWQiOiIyMDIyLTEyLTI1VDE3OjE1OjMxLjg4NloiLCJpc0FjdGl2ZSI6dHJ1ZSwicmVtZW1iZXJNZSI6dHJ1ZSwibG9naW5EYXRlIjoiMjAyMi0wNi0yOFQxNjoxNzoxMi40MDVaIiwiaWF0IjoxNjU2NDMzMDMyLCJuYmYiOjE2NTY0MzMwMzIsImV4cCI6MTY1ODIzMzAzMn0.c5wbf_z1qHu3tyyK6cqxJbBmBBPKGg2y4nWkAHeq_94", "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI4ODYyM2U2NDQ3MWI2NDRiYTc5M2MiLCJyZW1lbWJlck1lIjp0cnVlLCJsb2dpbkRhdGUiOiIyMDIyLTA2LTI4VDE2OjE3OjEyLjQwNVoiLCJpYXQiOjE2NTY0MzMwMzIsIm5iZiI6MTY1ODIzMzAzMiwiZXhwIjo0MjQ4NDMzMDMyfQ.c2z03KUoHtvynV71AbInOSE2XC4JQgBsg4z91UJR2Po"} }
     */
    @Response('auth.refresh')
    @AuthRefreshJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(AuthCommonController.name, 'refresh')
    @Post('/refresh')
    @ApiTags(AUTH_API_SWAGGER_TAG)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "accessToken": { "type": "string", "description": "Access token" },  "refreshToken": { "type": "string", "description": "Refresh token" }} }) })
    @ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted' })
    @ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered' })
    async refresh(
        @User()
        { _id, rememberMe, loginDate }: Record<string, any>,
        @Token() refreshToken: string
    ): Promise<IResponse> {
        const user: IUserDocument =
            await this.userService.findOneById<IUserDocument>(_id, {
                populate: {
                    role: true,
                    permission: true,
                },
            });

        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        } else if (!user.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        } else if (!user.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(user.passwordExpired);

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_EXPIRED_ERROR,
                message: 'auth.error.passwordExpired',
            });
        }

        const safe: AuthLoginSerialization =
            await this.authService.serializationLogin(user);
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(safe, rememberMe, {
                loginDate,
            });

        const accessToken: string = await this.authService.createAccessToken(
            payloadAccessToken
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Change actual user password
     */
    @Response('auth.changePassword')
    @AuthJwtGuard()
    @ErrorMeta(AuthCommonController.name, 'changePassword')
    @Patch('/change-password')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp() })
    @ApiHeader({ name: 'x-api-key', description: 'API Access Key, time-based & encrypted' })
    @ApiHeader({ name: 'x-timestamp', description: 'timestamp (ms) of the request when triggered' })
    async changePassword(
        @Body() body: AuthChangePasswordDto,
        @User('_id') _id: string
    ): Promise<void> {
        const user: UserDocument = await this.userService.findOneById(_id);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            user.password
        );
        if (!matchPassword) {
            throw new BadRequestException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NOT_MATCH_ERROR,
                message: 'auth.error.passwordNotMatch',
            });
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            user.password
        );
        if (newMatchPassword) {
            throw new BadRequestException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
                message: 'auth.error.newPasswordMustDifference',
            });
        }

        try {
            const password = await this.authService.createPassword(
                body.newPassword
            );
            
            await this.userService.updatePassword(user._id, password);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}
