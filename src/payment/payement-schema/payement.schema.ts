import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Infraction', required: true })
  infractionId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ enum: ['pending', 'paid', 'failed'], default: 'pending' })
  status: string;

  @Prop({ type: Object })
  receipt: {
    receiptNumber: string;
    userId: string;
    infractionId: string;
    amount: number;
    date: Date;
    status: string; // 'partial' or 'paid'
    message: string;
  };
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
