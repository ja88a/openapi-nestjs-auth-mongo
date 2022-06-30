import {
    Body,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthAdminJwtGuard } from 'src/auth/auth.decorator';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { RequestParamGuard } from 'src/utils/request/request.decorator';
import { Response } from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { getSchemaResp, getSchemaRespGen } from 'src/utils/response/response.serialization';
import { SettingRequestDto } from '../dto/setting.request.dto';
import { SettingUpdateDto } from '../dto/setting.update.dto';
import { SettingDocument } from '../schema/setting.schema';
import { SettingService } from '../service/setting.service';
import { SETTING_API_SWAGGER_TAG } from '../setting.constant';
import { GetSetting, SettingUpdateGuard } from '../setting.decorator';

@ApiTags(SETTING_API_SWAGGER_TAG)
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
@Controller({
    version: '1',
    path: 'setting',
})
export class SettingAdminController {
    constructor(private readonly settingService: SettingService) {}

    /**
     * Retrieve the details of a given setting
     */
    @Response('setting.update')
    @SettingUpdateGuard()
    @RequestParamGuard(SettingRequestDto)
    @AuthAdminJwtGuard(
        ENUM_PERMISSIONS.SETTING_READ,
        ENUM_PERMISSIONS.SETTING_UPDATE
    )
    @ErrorMeta(SettingAdminController.name, 'update')
    @Put('/update/:setting')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaRespGen({ "type": "object", "properties": { "_id": { "type": "string", "description": "ID of the updated setting"}}})})
    @ApiParam({name: 'setting', description: 'Target setting name', type: 'string'})
    async update(
        @GetSetting() setting: SettingDocument,
        @Body()
        body: SettingUpdateDto
    ): Promise<IResponse> {
        try {
            await this.settingService.updateOneById(setting._id, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: setting._id,
        };
    }
}
