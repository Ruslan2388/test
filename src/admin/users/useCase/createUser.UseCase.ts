import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';
import { CreateUserInputModelType } from '../dto/addUser.dto';

export class CreateUserCommand {
    constructor(public inputModel: CreateUserInputModelType) {}
}

@CommandHandler(CreateUserCommand)
export class createUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(protected usersRepository: UserRepository) {}
    async execute(command: CreateUserCommand) {
        const passwordHash = await this._generateHash(command.inputModel.password);
        const newUser = {
            accountData: {
                id: new Date().valueOf().toString(),
                email: command.inputModel.email,
                userName: command.inputModel.userName,
                password: passwordHash,
                createdAt: new Date().toISOString(),
            },
        };
        const result = await this.usersRepository.createUser({ ...newUser });
        if (!result)
            throw new BadRequestException([
                {
                    message: 'Bad',
                    field: 'login or Password',
                },
            ]);
        return {
            id: result.accountData.id,
            login: result.accountData.login,
            email: result.accountData.email,
            createdAt: result.accountData.createdAt,
        };
    }
    _generateHash(password: string) {
        return bcrypt.hash(password, 10);
    }
}
