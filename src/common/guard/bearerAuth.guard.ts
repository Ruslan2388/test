import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../admin/users/user.repository';

@Injectable()
export class BearerAuthGuard implements CanActivate {
    constructor(protected userRepository: UserRepository) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const auth = request.headers.authorization;
        if (!auth) throw new UnauthorizedException();
        const authType = auth.split(' ')[0];
        if (authType !== 'Bearer') {
            throw new UnauthorizedException();
        }
        const accessToken = request.headers.authorization.split(' ')[1];
        const user = await this.userRepository.getUserByAccessToken(accessToken);
        if (!user) throw new UnauthorizedException();
        if (user) {
            request.user = user;
            return true;
        }
        throw new UnauthorizedException();
    }
}
