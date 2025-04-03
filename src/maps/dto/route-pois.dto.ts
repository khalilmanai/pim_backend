import { ApiProperty } from '@nestjs/swagger';

export class RoutePoisDto {
  @ApiProperty({ description: 'The starting coordinates (latitude,longitude)' })
  start: string;

  @ApiProperty({ description: 'The ending coordinates (latitude,longitude)' })
  end: string;

  @ApiProperty({ description: 'The type of point of interest (restaurant, gas_station, etc.)', required: false })
  type?: string;
}