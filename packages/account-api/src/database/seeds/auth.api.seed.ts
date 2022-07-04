import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ApiKeyService } from 'src/apikey/service/api.key.service';
import { ApiKeyBulkService } from 'src/apikey/service/api.key.bulk.service';
import { ErrorMeta } from 'src/utils/error/error.decorator';

@Injectable()
export class AuthApiSeed {
    constructor(
        private readonly authApiService: ApiKeyService,
        private readonly authApiBulkService: ApiKeyBulkService
    ) {}

    @ErrorMeta(AuthApiSeed.name, 'insert')
    @Command({
        command: 'insert:authapis',
        describe: 'insert authapiss',
    })
    async insert(): Promise<void> {
        try {
            await this.authApiService.create({
                name: 'Auth Default',
                description: 'Default API Key used for authenticating users',
                key: 'qwertyuiop12345zxcvbnmkjh',
                secret: '5124512412412asdasdasdasdasdASDASDASD',
                passphrase: 'cuwakimacojulawu',
                encryptionKey: 'opbUwdiS1FBsrDUoPgZdx',
            });
        } catch (e) {
            throw new Error(e.message);
        }
        
        return;
    }

    @ErrorMeta(AuthApiSeed.name, 'remove')
    @Command({
        command: 'remove:authapis',
        describe: 'remove authapis',
    })
    async remove(): Promise<void> {
        try {
            await this.authApiBulkService.deleteMany({});
        } catch (e) {
            throw new Error(e.message);
        }
        
        return;
    }
}
