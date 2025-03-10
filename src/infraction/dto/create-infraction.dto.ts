import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInfractionDto {
  @IsString()
  plateSerie: string;

  @IsString()
  plateNumber: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  user: Types.ObjectId;
}
