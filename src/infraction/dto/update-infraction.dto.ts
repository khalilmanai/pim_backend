import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateInfractionDto {
  @IsOptional()
  @IsString()
  plateSerie?: string;

  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  user: Types.ObjectId;
}
