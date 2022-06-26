import { Test } from '@nestjs/testing';
import { ValidationError } from 'class-validator';
import { CoreModule } from 'src/core/core.module';
import { MessageService } from 'src/message/service/message.service';

describe('MessageService', () => {
    let messageService: MessageService;

    let validationError: ValidationError[];
    let validationErrorTwo: ValidationError[];
    let validationErrorThree: ValidationError[];
    let validationErrorConstrainEmpty: ValidationError[];

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CoreModule],
        }).compile();

        messageService = moduleRef.get<MessageService>(MessageService);

        validationError = [
            {
                target: {
                    email: 'admin-mail.com',
                    password: 'aaAA@@123444',
                    rememberMe: true,
                },
                value: 'admin-mail.com',
                property: 'email',
                children: [],
                constraints: { isEmail: 'email must be an email' },
            },
        ];

        validationErrorTwo = [
            {
                target: {
                    email: 'admin-mail.com',
                    password: 'aaAA@@123444',
                    rememberMe: true,
                },
                value: 'admin-mail.com',
                property: 'email',
                constraints: { isEmail: 'email must be an email' },
                children: [
                    {
                        target: {
                            email: 'admin-mail.com',
                            password: 'aaAA@@123444',
                            rememberMe: true,
                        },
                        value: 'admin-mail.com',
                        property: 'email',
                        constraints: {
                            isEmail: 'email must be an email',
                        },
                        children: [],
                    },
                ],
            },
        ];

        validationErrorThree = [
            {
                target: {
                    email: 'admin-mail.com',
                    password: 'aaAA@@123444',
                    rememberMe: true,
                },
                value: 'admin-mail.com',
                property: 'email',
                constraints: { isEmail: 'email must be an email' },
                children: [
                    {
                        target: {
                            email: 'admin-mail.com',
                            password: 'aaAA@@123444',
                            rememberMe: true,
                        },
                        value: 'admin-mail.com',
                        property: 'email',
                        constraints: {
                            isEmail: 'email must be an email',
                        },
                        children: [
                            {
                                target: {
                                    email: 'admin-mail.com',
                                    password: 'aaAA@@123444',
                                    rememberMe: true,
                                },
                                value: 'admin-mail.com',
                                property: 'email',
                                constraints: {
                                    isEmail: 'email must be an email',
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ];

        validationErrorConstrainEmpty = [
            {
                target: {
                    email: 'admin-mail.com',
                    password: 'aaAA@@123444',
                    rememberMe: true,
                },
                value: 'admin-mail.com',
                property: 'email',
                children: [],
            },
        ];
    });

    it('should be defined', () => {
        expect(messageService).toBeDefined();
    });

    describe('get', () => {
        it('should be called', async () => {
            const test = jest.spyOn(messageService, 'get');

            await messageService.get('test.hello');
            expect(test).toHaveBeenCalledWith('test.hello');
        });

        it('should be success', async () => {
            const message = messageService.get('test.hello');
            jest.spyOn(messageService, 'get').mockImplementation(() => message);

            expect(messageService.get('test.hello')).toBe(message);
        });
    });

    describe('getRequestErrorsMessage', () => {
        it('should be called', async () => {
            const test = jest.spyOn(messageService, 'getRequestErrorsMessage');

            await messageService.getRequestErrorsMessage(validationError);
            expect(test).toHaveBeenCalledWith(validationError);
        });

        it('single message should be success', async () => {
            const message = await messageService.getRequestErrorsMessage(
                validationError,
                ['en']
            );
            jest.spyOn(
                messageService,
                'getRequestErrorsMessage'
            ).mockImplementation(async () => message);

            expect(
                await messageService.getRequestErrorsMessage(validationError, [
                    'en',
                ])
            ).toBe(message);
        });

        it('multi message should be success', async () => {
            const message = await messageService.getRequestErrorsMessage(
                validationError,
                ['en', 'id']
            );
            jest.spyOn(
                messageService,
                'getRequestErrorsMessage'
            ).mockImplementation(async () => message);

            expect(
                await messageService.getRequestErrorsMessage(validationError, [
                    'en',
                    'id',
                ])
            ).toBe(message);
        });

        it('should be success', async () => {
            const message = await messageService.getRequestErrorsMessage(
                validationError
            );
            jest.spyOn(
                messageService,
                'getRequestErrorsMessage'
            ).mockImplementation(async () => message);

            expect(
                await messageService.getRequestErrorsMessage(validationError)
            ).toBe(message);
        });

        it('should be success', async () => {
            const message = await messageService.getRequestErrorsMessage(
                validationError
            );
            jest.spyOn(
                messageService,
                'getRequestErrorsMessage'
            ).mockImplementation(async () => message);

            expect(
                await messageService.getRequestErrorsMessage(validationError)
            ).toBe(message);
        });

        it('two children should be success', async () => {
            const message = await messageService.getRequestErrorsMessage(
                validationErrorTwo
            );
            jest.spyOn(
                messageService,
                'getRequestErrorsMessage'
            ).mockImplementation(async () => message);

            expect(
                await messageService.getRequestErrorsMessage(validationErrorTwo)
            ).toBe(message);
        });

        it('three children should be success', async () => {
            const message = await messageService.getRequestErrorsMessage(
                validationErrorThree
            );
            jest.spyOn(
                messageService,
                'getRequestErrorsMessage'
            ).mockImplementation(async () => message);

            expect(
                await messageService.getRequestErrorsMessage(
                    validationErrorThree
                )
            ).toBe(message);
        });

        it('empty constrain should be success', async () => {
            const message = await messageService.getRequestErrorsMessage(
                validationErrorConstrainEmpty
            );
            jest.spyOn(
                messageService,
                'getRequestErrorsMessage'
            ).mockImplementation(async () => message);

            expect(
                await messageService.getRequestErrorsMessage(
                    validationErrorConstrainEmpty
                )
            ).toBe(message);
        });
    });

    describe('getLanguages', () => {
        it('should be called', async () => {
            const test = jest.spyOn(messageService, 'getLanguages');

            await messageService.getLanguages();
            expect(test).toHaveBeenCalled();
        });

        it('should be success', async () => {
            const languages = messageService.getLanguages();
            jest.spyOn(messageService, 'getLanguages').mockImplementation(
                () => languages
            );

            expect(messageService.getLanguages()).toBe(languages);
        });
    });
});
