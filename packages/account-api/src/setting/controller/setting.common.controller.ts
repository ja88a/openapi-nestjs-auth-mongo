import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { PAGINATION_DEFAULT_PAGE, PAGINATION_DEFAULT_PER_PAGE, PAGINATION_DEFAULT_SORT } from 'src/pagination/pagination.constant';
import { PaginationService } from 'src/pagination/service/pagination.service';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { RequestParamGuard } from 'src/utils/request/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/utils/response/response.interface';
import { getSchemaResp, getSchemaRespGen } from 'src/utils/response/response.serialization';
import { SettingListDto } from '../dto/setting.list.dto';
import { SettingRequestDto } from '../dto/setting.request.dto';
import { SettingDocument } from '../schema/setting.schema';
import { SettingGetSerialization } from '../serialization/setting.get.serialization';
import { SettingListSerialization } from '../serialization/setting.list.serialization';
import { SettingService } from '../service/setting.service';
import { SETTING_API_SWAGGER_TAG } from '../setting.constant';
import {
    GetSetting,
    SettingGetByNameGuard,
    SettingGetGuard,
} from '../setting.decorator';

@ApiTags(SETTING_API_SWAGGER_TAG)
@ApiBearerAuth()
@ApiHeader({ name: 'x-api-key', description: 'API Access Key: time-based & encrypted', required: true, example: 'qwertyuiop12345zxcvbnmkjh:U2FsdGVkX1+jjNsr1IYqGeuQtwZR/pn1D2II4SvKhbyT9uvZND20Eldw4yetD1lLiHEIsP14O0o9HD68QSQX9HHXBuPCkarRBxukKnK0jUKLtIfbyJUvZDu8olEcmuY1LL7eo/4dmKPigWYxaXYzYx8Rp0r65ODX5uZwGZmKg/5IWYA/mFA2N1Op+zFurfA5XIgGeluXr0xpvpGmRSiJ+A=='})
@ApiHeader({ name: 'x-timestamp', description: 'Timestamp (ms) of the request when triggered', required: true, example: 1656450618419})
@ApiResponse({ status: HttpStatus.OK, description: 'Request successful.', schema: getSchemaRespGen({"type": "object"})})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden request.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Unknown role.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service processing error.', schema: getSchemaResp() })
@ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Service unavailable.', schema: getSchemaResp() })
@ApiExtraModels(SettingListSerialization)
@ApiExtraModels(SettingGetSerialization)
@Controller({
    version: '1',
    path: 'setting',
})
export class SettingCommonController {
    constructor(
        private readonly settingService: SettingService,
        private readonly paginationService: PaginationService
    ) {}

    /**
     * Retrieve a list of available settings
     */
    @ResponsePaging('setting.list')
    @ErrorMeta(SettingCommonController.name, 'list')
    @Get('/list')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(SettingListSerialization, true)})
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
        }: SettingListDto
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
        const settings: SettingDocument[] = await this.settingService.findAll(
            find,
            {
                limit: perPage,
                skip: skip,
                sort,
            }
        );
        const totalData: number = await this.settingService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        const data: SettingListSerialization[] =
            await this.settingService.serializationList(settings);

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
     * Retrieve the details of a given setting
     */
    @Response('setting.get')
    @SettingGetGuard()
    @RequestParamGuard(SettingRequestDto)
    @ErrorMeta(SettingCommonController.name, 'get')
    @Get('get/:setting')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(SettingGetSerialization)})
    @ApiParam({name: 'setting', description: 'Target setting name', type: 'string'})
    async get(@GetSetting() setting: SettingDocument): Promise<IResponse> {
        return this.settingService.serializationGet(setting);
    }

    /** 
     * Retrieve the details of a given setting ``experimental`` 
     */
    @Response('setting.getByName')
    @SettingGetByNameGuard()
    @ErrorMeta(SettingCommonController.name, 'getByName')
    @Get('get/name/:settingName')
    @ApiOkResponse({ description: 'Request successful.', schema: getSchemaResp(SettingGetSerialization)})
    @ApiParam({name: 'settingName', description: 'Target setting name', type: 'string'})
    async getByName(
        @GetSetting() setting: SettingDocument
    ): Promise<IResponse> {
        return this.settingService.serializationGet(setting);
    }
}
