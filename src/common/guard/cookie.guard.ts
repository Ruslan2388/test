import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenPayloadType } from '../types/jwt.types';
import { JwtAdapter } from '../jwtAdapter/jwt.adapter';
import { SessionRepository } from '../session/session.repository';

@Injectable()
export class CookieGuard implements CanActivate {
    constructor(private jwtAdapter: JwtAdapter, private readonly sessionsRepository: SessionRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const refreshToken = request.cookies?.refreshToken;
        console.log(refreshToken);
        const payload = await this.checkAuthorizationAndGetPayload(refreshToken);
        if (!payload) {
            throw new UnauthorizedException();
        }
        request.payload = payload;
        return true;
    }
    private async checkAuthorizationAndGetPayload(refreshToken?: string): Promise<RefreshTokenPayloadType | null> {
        const result = this.jwtAdapter.checkExpirationRefreshToken(refreshToken);
        if (!result) return null;

        const payload = this.jwtAdapter.getRefreshTokenPayload(refreshToken);
        const statusSession = await this.isActiveSession(payload.sessionId);
        if (!statusSession) return null;

        return payload;
    }
    private async isActiveSession(sessionId: string): Promise<boolean> {
        const result = await this.sessionsRepository.getBySessionId(sessionId);
        return !!result;
    }
}
