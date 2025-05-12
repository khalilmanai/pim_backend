import { IsString, IsNumber, Min, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID of the user making the payment',
    example: '67c3147151c553707aaf0d86',
  })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: 'ID of the infraction being paid',
    example: '681be041dc66a6983144afb3',
  })
  @IsMongoId()
  infractionId: string;

  @ApiProperty({ description: 'Payment amount in TND', example: 200 })
  @IsNumber()
  @Min(0)
  amount: number;
}
