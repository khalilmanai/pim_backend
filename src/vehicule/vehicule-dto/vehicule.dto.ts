import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class VehiculeDto {
  @ApiProperty({
    example: '123ABC',
    description: 'Unique vehicle plate number',
  })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ example: 'TUN', description: 'Unique vehicle plate series' })
  @IsString()
  @IsNotEmpty()
  plateSerie: string;

  @ApiProperty({ example: 'Toyota', description: 'Brand of the vehicle' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Model of the vehicle' })
  @IsString()
  @IsNotEmpty()
  carModel: string;

  @ApiProperty({
    example: 2022,
    description: 'Manufacturing year of the vehicle',
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    example: 'Red',
    description: 'Color of the vehicle',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: '1HGCM82633A123456',
    description: 'Vehicle Identification Number (VIN)',
  })
  @IsString()
  @IsNotEmpty()
  vin: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Owner user ID (MongoDB ObjectId)',
  })
  @IsString()
  @IsNotEmpty()
  owner: string;
}
