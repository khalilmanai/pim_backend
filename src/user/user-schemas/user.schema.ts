import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  image: string;

  @Prop()
  token: string;

  @Prop({ required: true, unique: true })
  cin: string; // National Identity Number

  // An array of vehicles owned by the user
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Vehicule' }] })
  vehicles: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
