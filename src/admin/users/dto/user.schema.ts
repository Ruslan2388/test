import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

class AccountData {
    @Prop()
    id: string;
    @Prop({ type: String })
    login: string;
    @Prop({ type: String })
    password: string;
    @Prop({ type: String })
    email: string;
    @Prop()
    createdAt: string;
    @Prop()
    userName: string;
}

@Schema()
export class User {
    @Prop()
    accountData: AccountData;
}
export const UserSchema = SchemaFactory.createForClass(User);
