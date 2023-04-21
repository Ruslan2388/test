import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../admin/users/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email', passwordField: 'password' });
    }

    async validate(email: string, password: string): Promise<string> {
        const userId = await this.authService.validateUser(email, password);
        if (!userId) throw new UnauthorizedException();
        console.log(userId);
        return userId;
    }
}
