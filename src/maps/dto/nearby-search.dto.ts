import { ApiProperty } from '@nestjs/swagger';

export class NearbySearchDto {
  @ApiProperty({ description: 'The location coordinates (latitude,longitude)' })
  location: string;

  @ApiProperty({ description: 'The search radius in meters', required: false })
  radius?: number;

  @ApiProperty({ description: 'The type of place to search for', required: false })
  type?: string;
}