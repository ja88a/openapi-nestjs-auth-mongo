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
        const { passwordExpired } = user;
        const today: Date = this.helperDateService.create();
        const passwordExpiredDate = this.helperDateService.create({
            date: passwordExpired,
        });

        if (today > passwordExpiredDate) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_GUARD_PASSWORD_EXPIRED_ERROR,
                message: 'auth.error.passwordExpired',
            });
        }

        return true;
    }
}
