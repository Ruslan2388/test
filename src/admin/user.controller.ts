import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './users/auth.service';

@Controller('user')
export class UserController {
    constructor(protected authService: AuthService) {}
    @Get('')
    async getAllUsers() {
        return await this.authService.getAllUsers();
    }

    @Get('online/:userId')
    async getOnline(@Param('userId') userId) {
        return await this.authService.getOnline(userId);
    }
}
