import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayloadType, Tokens } from '../types/jwt.types';

@Injectable()
export class JwtAdapter {
    constructor(private jwtService: JwtService) {}

    getTokens(userId: string, sessionId: string): Tokens {
        const accessToken = this.createJWT(userId);
        const refreshToken = this.createRefreshJWT(userId, sessionId);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
    checkExpirationRefreshToken(token: string): boolean {
        try {
            this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            return true;
        } catch {
            return false;
        }
    }
    getRefreshTokenPayload(refreshToken: string): RefreshTokenPayloadType | null {
        try {
            return this.jwtService.decode(refreshToken) as RefreshTokenPayloadType;
        } catch {
            return null;
        }
    }
    private createJWT(userId: string): string {
        return this.jwtService.sign(
            { userId: userId },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: process.env.EXPIRE_ACCESS_JWT + 'm',
            },
        );
    }
    private createRefreshJWT(userId: string, sessionId: string): string {
        return this.jwtService.sign(
            { userId: userId, sessionId: sessionId },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: process.env.EXPIRE_REFRESH_JWT + 'm',
            },
        );
    }
}
