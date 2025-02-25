import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Vehicule extends Document {
  @Prop({ required: true, unique: true })
  plateNumber: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  carModel: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: false })
  color: string;

  // Reference to the owner (User)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const VehiculeSchema = SchemaFactory.createForClass(Vehicule);
