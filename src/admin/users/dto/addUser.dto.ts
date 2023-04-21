import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserInputModelType {
    @Length(4, 30)
    userName: string;

    @Length(6, 20)
    @IsString()
    password: string;

    @IsEmail({}, { message: 'Incorrect Email' })
    @Length(1, 40)
    email: string;
}
