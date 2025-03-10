import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Infraction extends Document {
  @Prop({ required: true })
  plateSerie: string;

  @Prop({ required: true })
  plateNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  description: string;
}

export const InfractionSchema = SchemaFactory.createForClass(Infraction);