import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthExcludeApiKey, AuthExcludeApiKeyHeader } from 'src/apikey/api.key.decorator';
import { ENUM_LOGGER_ACTION } from 'src/logger/logger.constant';
import { Logger } from 'src/logger/logger.decorator';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import { HelperService } from 'src/utils/helper/service/helper.service';
import {
    RequestTimezone,
    RequestUserAgent,
} from 'src/utils/request/request.decorator';
import {
    Response,
    ResponseTimeout,
} from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { getSchemaResp } from 'src/utils/response/response.serialization';
import { IResult } from 'ua-parser-js';

@ApiTags('Tests')
@ApiResponse({ status: HttpStatus.OK, description: 'Request successful.', schema: getSchemaResp('{ "type": "object", "additionalProperties": false, "title": "data output"}')})
@Controller({
    version: '1', // VERSION_NEUTRAL
    //path: '/',
})
export class TestingCommonController {
    constructor(
        private readonly helperDateService: HelperDateService,
        private readonly helperService: HelperService
    ) {}

    @Response('test.hello')
    @AuthExcludeApiKeyHeader()
    @ErrorMeta(TestingCommonController.name, 'hello')
    @Get('/hello')
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['test'] })
    async hello(
        @RequestUserAgent() userAgent: IResult,
        @RequestTimezone() timezone: string
    ): Promise<IResponse> {
        const newDate = this.helperDateService.create({
            timezone: timezone,
        });
        return {
            userAgent,
            date: newDate,
            format: this.helperDateService.format(newDate, {
                timezone: timezone,
            }),
            timestamp: this.helperDateService.timestamp({
                date: newDate,
                timezone: timezone,
            }),
        };
    }

    @Response('test.helloTimeout')
    @AuthExcludeApiKey()
    @ResponseTimeout('10s')
    @Logger(ENUM_LOGGER_ACTION.TEST_TIMEOUT, { tags: ['test', 'timeout'] })
    @ErrorMeta(TestingCommonController.name, 'helloTimeout')
    @Get('/hello-timeout')
    async helloTimeout(): Promise<IResponse> {
        await this.helperService.delay(60000);

        return;
    }
}
