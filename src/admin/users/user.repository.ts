import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './dto/user.schema';
import { Session, SessionDocument } from './session.schema';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    ) {}

    async getUserByEmail(email: string): Promise<UserDocument | null> {
        try {
            return this.userModel.findOne({ 'accountData.email': email });
        } catch (e) {
            return null;
        }
    }

    async getUserByAccessToken(accessToken: string) {
        try {
            const result: any = this.jwtService.verify(accessToken, { secret: '123' });
            const userId = result.userId;
            return this.userModel.findOne({ 'accountData.id': userId });
        } catch (error) {
            return null;
        }
    }

    async createUser(newUser): Promise<User | null> {
        try {
            return this.userModel.create(newUser);
        } catch (e) {
            return null;
        }
    }

    async getAllUsers() {
        return await this.userModel.find({});
    }

    async getOnline(userId: string) {
        return await this.sessionModel.findOne({ userId: userId }, { createdAt: 1 });
    }
}
