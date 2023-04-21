import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    @Prop({ required: true })
    id: string;
    @Prop({ required: true })
    userId: string;
    @Prop({ required: true })
    issueAt: string;
    @Prop({ required: true })
    expireAt: string;
    @Prop({ required: true })
    deviceName: string;
    @Prop({ required: true })
    ip: string;
    @Prop({ required: true })
    createdAt: Date;

    updateDate: () => boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.methods.updateDate = function (): boolean {
    const date = new Date();

    this.issueAt = date.toISOString();
    this.expireAt = add(date, { minutes: +process.env.EXPIRE_REFRESH_JWT }).toISOString();

    return true;
};
