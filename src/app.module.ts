import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtAdapter } from './common/jwtAdapter/jwt.adapter';
import { AuthService } from './admin/users/auth.service';
import { SessionRepository } from './common/session/session.repository';
import { UserRepository } from './admin/users/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './api/auth/auth.controller';
import { createUserUseCase } from './admin/users/useCase/createUser.UseCase';
import { CreateSessionUseCase } from './admin/users/useCase/createSessionUseCase';
import { UpdateSessionUseCase } from './admin/users/useCase/update.session.useCase';
import { RemoveSessionUseCase } from './admin/users/useCase/remove.session.userCase';
import { LocalStrategy } from './common/strategy/local.strategy';
import { Session, SessionSchema } from './admin/users/session.schema';
import { User, UserSchema } from './admin/users/dto/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { UserController } from './admin/user.controller';

const controller = [AppController, AuthController, UserController];
const service = [AppService, AuthService, JwtAdapter, JwtService];
const repository = [UserRepository, SessionRepository];
const validators = [];
const useCases = [createUserUseCase, CreateSessionUseCase, UpdateSessionUseCase, RemoveSessionUseCase];
const strategy = [LocalStrategy];

@Module({
    imports: [
        ThrottlerModule.forRoot({
            ttl: 10,
            limit: 5,
        }),
        CqrsModule,
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Session.name, schema: SessionSchema },
        ]),
    ],

    controllers: [...controller],
    providers: [...repository, ...service, ...validators, ...useCases, ...strategy, ChatGateway],
})
export class AppModule {}
