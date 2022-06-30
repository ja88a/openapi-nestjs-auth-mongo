import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthPublicJwtGuard } from 'src/auth/auth.decorator';
import { IAwsS3Response } from 'src/aws/aws.interface';
import { AwsS3Service } from 'src/aws/service/aws.s3.service';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { ENUM_FILE_TYPE } from 'src/utils/file/file.constant';
import { UploadFileSingle } from 'src/utils/file/file.decorator';
import { Response } from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { getSchemaResp } from 'src/utils/response/response.serialization';
import { UserProfileSerialization } from '../serialization/user.profile.serialization';
import { UserService } from '../service/user.service';
import { GetUser, UserProfileGuard } from '../user.decorator';
import { IUserDocument } from '../user.interface';

@ApiTags('Users')
@ApiBearerAuth()
@ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted', required: true, example: 'qwertyuiop12345zxcvbnmkjh:U2FsdGVkX1+jjNsr1IYqGeuQtwZR/pn1D2II4SvKhbyT9uvZND20Eldw4yetD1lLiHEIsP14O0o9HD68QSQX9HHXBuPCkarRBxukKnK0jUKLtIfbyJUvZDu8olEcmuY1LL7eo/4dmKPigWYxaXYzYx8Rp0r65ODX5uZwGZmKg/5IWYA/mFA2N1Op+zFurfA5XIgGeluXr0xpvpGmRSiJ+A=='})
@ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered', required: true, example: 1656450618419})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
@ApiExtraModels(UserProfileSerialization)
@Controller({
    version: '1',
    path: 'user',
})
export class UserPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly awsService: AwsS3Service
    ) {}

    /**
     * Retrieve the user profile
     */
    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(UserPublicController.name, 'profile')
    @Get('/profile')
    @ApiOkResponse({description: 'Request successful.', schema: getSchemaResp(UserProfileSerialization)})
    async profile(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationProfile(user);
    }

    /**
     * Upload a profile picture to the AWS S3 bucket - alpha
     */
    @Response('user.upload')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(UserPublicController.name, 'upload')
    @Post('/profile/upload')
    @ApiOkResponse({description: 'Request successful.', schema: getSchemaResp()})
    async upload(
        @GetUser() user: IUserDocument,
        @UploadedFile() file: Express.Multer.File
    ): Promise<void> {
        const filename: string = file.originalname;
        const content: Buffer = file.buffer;
        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toUpperCase();

        const path = await this.userService.createRandomFilename();

        try {
            const aws: IAwsS3Response = await this.awsService.putItemInBucket(
                `${path.filename}.${mime}`,
                content,
                {
                    path: `${path.path}/${user._id}`,
                }
            );

            await this.userService.updatePhoto(user._id, aws);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}
