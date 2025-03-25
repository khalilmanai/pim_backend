import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/user-schemas/user.schema';

@Schema()
export class Infraction {
  @Prop({ required: true })
  serie: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  location?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;
  @Prop({ required: true })
  amount: number;
}

export const InfractionSchema = SchemaFactory.createForClass(Infraction);
