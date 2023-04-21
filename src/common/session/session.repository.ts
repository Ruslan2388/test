import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { add } from 'date-fns';
import { Session, SessionDocument } from '../../admin/users/session.schema';

@Injectable()
export class SessionRepository {
    constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

    async getBySessionId(sessionId: string): Promise<SessionDocument | null> {
        try {
            return this.sessionModel.findOne({ id: sessionId });
        } catch (e) {
            return null;
        }
    }
    async saveSession(session: SessionDocument): Promise<SessionDocument> {
        return session.save();
    }
    async createOrUpdateSession(userId: string, ip: string, deviceName: string): Promise<SessionDocument> {
        const date = new Date();

        const session = await this.sessionModel.findOneAndUpdate(
            { userId: userId, deviceName: deviceName, ip: ip },
            {
                id: date.valueOf().toString(),
                userId: userId,
                issueAt: date.toISOString(),
                expireAt: add(date, { minutes: +process.env.EXPIRE_REFRESH_JWT }).toISOString(),
                deviceName: deviceName,
                ip: ip,
                createdAt: new Date(),
            },
            { upsert: true, new: true },
        );

        return session;
    }
    async deleteSession(sessionId: string): Promise<boolean> {
        try {
            await this.sessionModel.findOneAndDelete({ id: sessionId });
            return true;
        } catch (e) {
            return false;
        }
    }
}
