import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersRepository: UserRepository) {}

    async getAllUsers() {
        return await this.usersRepository.getAllUsers();
    }

    async validateUser(email: string, password: string): Promise<string> {
        const user = await this.usersRepository.getUserByEmail(email);

        if (!user) throw new UnauthorizedException();
        const result = await bcrypt.compare(password, user.accountData.password);
        if (!result) throw new UnauthorizedException();

        return user.accountData.id;
    }

    async getOnline(userId: string) {
        return await this.usersRepository.getOnline(userId);
    }
}
