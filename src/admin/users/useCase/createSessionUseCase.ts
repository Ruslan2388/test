import { CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../common/session/session.repository';

export class CreateSessionCommand {
    constructor(public userId: string, public ip: string, public deviceName: string) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase {
    constructor(private jwtService: JwtService, private sessionsRepository: SessionRepository) {}

    async execute(command: CreateSessionCommand): Promise<string> {
        const { userId, ip, deviceName = 'unknown' } = command;

        const session = await this.sessionsRepository.createOrUpdateSession(userId, ip, deviceName);

        return session.id;
    }
}
