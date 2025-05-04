import { IsNotEmpty } from 'class-validator';

export class CreateInfractionDto {
  @IsNotEmpty({ message: 'serie is required' })
  serie: string;
  @IsNotEmpty({ message: 'Plate number is required' })
  number: string;
  @IsNotEmpty({ message: 'Infraction type is required' })
  type: string;
  @IsNotEmpty({ message: 'Infraction date is required' })
  date: Date;
  @IsNotEmpty({ message: 'Infraction location is required' })
  location?: string;
  @IsNotEmpty({ message: 'Infraction amount is required' })
  amount?: string;
  @IsNotEmpty({ message: 'User ID is required' })
  user: string;
}
