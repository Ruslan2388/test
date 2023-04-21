import { CommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../common/session/session.repository';

export class RemoveSessionCommand {
    constructor(public sessionId: string) {}
}

@CommandHandler(RemoveSessionCommand)
export class RemoveSessionUseCase {
    constructor(private sessionsRepository: SessionRepository) {}

    async execute(command: RemoveSessionCommand): Promise<boolean> {
        await this.sessionsRepository.deleteSession(command.sessionId);
        return true;
    }
}
