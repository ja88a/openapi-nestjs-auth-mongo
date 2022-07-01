import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
    'app',
    (): Record<string, any> => ({
        name: process.env.APP_NAME || 'sopenapi-account',
        env: process.env.APP_ENV || 'development',
        mode: process.env.APP_MODE || 'simple',
        language: process.env.APP_LANGUAGE || 'en',
        timezone: process.env.APP_TZ || 'Europe/Paris',

        http: {
            host: process.env.APP_HOST || 'localhost',
            port: Number.parseInt(process.env.APP_PORT) || 3000,
        },
        globalPrefix: '/api/account',
        versioning: {
            on: process.env.APP_VERSIONING === 'true' || false,
            prefix: 'v',
        },
        debug: process.env.APP_DEBUG === 'true' || false,
        debugger: {
            http: {
                maxFiles: 5,
                maxSize: '2M',
            },
            system: {
                active: false,
                maxFiles: ms('7d'),
                maxSize: '2m',
            },
        },

        httpOn: process.env.APP_HTTP_ON === 'true' ? true : false,
        taskOn: process.env.APP_TASK_ON === 'true' || false,
        swaggerOn: process.env.APP_SWAGGER_ON === 'true' || false,
    })
);
