import { Controller, Get, HttpCode, HttpStatus, Ip, Post, Res, UseGuards, Headers, Body } from '@nestjs/common';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserInputModelType } from '../../admin/users/dto/addUser.dto';
import { CreateUserCommand } from '../../admin/users/useCase/createUser.UseCase';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CurrentUser } from '../../common/decorator/current.user.decorator';
import { PayloadFromRefreshToken } from '../../common/decorator/payload.token.decorator';
import { RefreshTokenPayloadType } from '../../common/types/jwt.types';
import { CookieGuard } from '../../common/guard/cookie.guard';
import { LocalAuthGuard } from '../../common/guard/local.auth.guard';
import { BearerAuthGuard } from '../../common/guard/bearerAuth.guard';
import { JwtAdapter } from '../../common/jwtAdapter/jwt.adapter';
import { AuthService } from '../../admin/users/auth.service';
import { UpdateSessionCommand } from '../../admin/users/useCase/update.session.useCase';
import { CreateSessionCommand } from '../../admin/users/useCase/createSessionUseCase';
import { RemoveSessionCommand } from '../../admin/users/useCase/remove.session.userCase';
import { UserDecorator } from '../../common/decorator/user.decorator';
import { User } from '../../admin/users/dto/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private commandBus: CommandBus, private jwtAdapter: JwtAdapter, private authService: AuthService) {}

    @UseGuards(BearerAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    async authMe(@UserDecorator() user: User) {
        return { email: user.accountData.email, userId: user.accountData.id, userName: user.accountData.userName };
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration')
    async registration(@Body() inputModel: CreateUserInputModelType) {
        return this.commandBus.execute(new CreateUserCommand(inputModel));
    }

    @UseGuards(ThrottlerGuard, LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Ip() ip: string,
        @Headers('user-agent')
        deviceName: string,
        @CurrentUser() userId: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        const sessionId = await this.commandBus.execute(new CreateSessionCommand(userId, ip, deviceName));

        const { accessToken, refreshToken } = await this.jwtAdapter.getTokens(userId, sessionId);

        response.cookie('refreshToken', refreshToken, { sameSite: 'none', httpOnly: true, secure: false });

        return { accessToken: accessToken };
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    @UseGuards(CookieGuard)
    async refreshToken(@PayloadFromRefreshToken() payload: RefreshTokenPayloadType, @Res({ passthrough: true }) response: Response) {
        await this.commandBus.execute(new UpdateSessionCommand(payload.sessionId));

        const { accessToken, refreshToken } = await this.jwtAdapter.getTokens(payload.userId, payload.sessionId);

        response.cookie('refreshToken', refreshToken, { sameSite: 'none', httpOnly: true, secure: false });

        return { accessToken: accessToken };
    }

    @UseGuards(CookieGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(@PayloadFromRefreshToken() payload: RefreshTokenPayloadType, @Res({ passthrough: true }) response: Response) {
        await this.commandBus.execute(new RemoveSessionCommand(payload.sessionId));
        response.clearCookie('refreshToken');
        return;
    }
}
