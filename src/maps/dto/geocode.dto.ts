import { ApiProperty } from '@nestjs/swagger';

export class GeocodeDto {
  @ApiProperty({ description: 'The address to geocode' })
  address: string;
}