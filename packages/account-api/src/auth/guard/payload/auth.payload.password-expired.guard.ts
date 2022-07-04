import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { ENUM_AUTH_STATUS_CODE_ERROR } from 'src/auth/auth.constant';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';

@Injectable()
export class AuthPayloadPasswordExpiredGuard implements CanActivate {
    constructor(private readonly helperDateService: HelperDateService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();
        const { passwordExpiration } = user;
        const today: Date = this.helperDateService.create();
        const passwordExpirationDate = this.helperDateService.create({
            date: passwordExpiration,
        });

        if (today > passwordExpirationDate) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_GUARD_PASSWORD_EXPIRED_ERROR,
                message: 'auth.error.passwordExpiration',
            });
        }

        return true;
    }
}
