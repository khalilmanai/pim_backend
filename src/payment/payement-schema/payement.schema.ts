import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Infraction', required: true })
  infractionId: Types.ObjectId;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: 'pending' }) // pending | paid | failed
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
