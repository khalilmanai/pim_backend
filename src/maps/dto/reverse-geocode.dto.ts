import { ApiProperty } from '@nestjs/swagger';

export class ReverseGeocodeDto {
  @ApiProperty({ description: 'The latitude coordinate' })
  lat: number;

  @ApiProperty({ description: 'The longitude coordinate' })
  lng: number;
}