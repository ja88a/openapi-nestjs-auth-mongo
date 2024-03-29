import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const env: string = configService.get<string>('app.env');
    const tz: string = configService.get<string>('app.timezone');
    const host: string = configService.get<string>('app.http.host');
    const port: number = configService.get<number>('app.http.port');
    const globalPrefix: string = configService.get<string>('app.globalPrefix');
    const versioning: boolean = configService.get<boolean>('app.versioning.on');
    const versioningPrefix: string = configService.get<string>(
        'app.versioning.prefix'
    );

    const logger = new Logger();
    process.env.TZ = tz;
    process.env.NODE_ENV = env;

    // Global
    app.setGlobalPrefix(globalPrefix);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Versioning
    if (versioning) {
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: VERSION_NEUTRAL,
            prefix: versioningPrefix,
        });
    }
    
    // Swagger doc
    const swaggerOn: boolean = configService.get<boolean>('app.swaggerOn');
    if (swaggerOn) {
        const config = new DocumentBuilder()
            .setTitle('S*OpenAPI Account Service')
            .setDescription('Accounts management API: users, permissions, roles & authentication')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const options: SwaggerDocumentOptions =  {
            operationIdFactory: (
                controllerKey: string,
                methodKey: string
            ) => methodKey
        };
        const document = SwaggerModule.createDocument(app, config, options);
        const customOptions: SwaggerCustomOptions = {
            swaggerOptions: {
                persistAuthorization: true,
            },
            customSiteTitle: 'S*OpenAPI Docs',
            //customfavIcon: 
        };
        SwaggerModule.setup('api/sales/v1', app, document, customOptions);
    } 

    // Listen
    await app.listen(port, host);

    logger.log(`==========================================================`);
    logger.log(`App Environment is ${env}`, 'NestApplication');
    logger.log(
        `App Language is ${configService.get<string>('app.language')}`,
        'NestApplication'
    );
    logger.log(
        `App Debug is ${configService.get<boolean>('app.debug')}`,
        'NestApplication'
    );
    logger.log(`App Versioning is ${versioning}`, 'NestApplication');
    logger.log(
        `App Http is ${configService.get<boolean>('app.httpOn')}`,
        'NestApplication'
    );
    logger.log(
        `App Task is ${configService.get<boolean>('app.taskOn')}`,
        'NestApplication'
    );
    logger.log(`App Swagger Doc is ${configService.get<boolean>('app.swaggerOn')}`, 'NestApplication');
    logger.log(`App Timezone is ${tz}`, 'NestApplication');
    logger.log(
        `Database Debug is ${configService.get<boolean>('database.debug')}`,
        'NestApplication'
    );

    logger.log(`==========================================================`);

    logger.log(
        `Database running on ${configService.get<string>(
            'database.host'
        )}/${configService.get<string>('database.name')}`,
        'NestApplication'
    );
    logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');

    logger.log(`==========================================================`);
}
bootstrap();
