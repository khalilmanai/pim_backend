import { ApiProperty } from '@nestjs/swagger';

export class MultiModalDirectionsDto {
  @ApiProperty({ description: 'The starting coordinates (latitude,longitude)' })
  start: string;

  @ApiProperty({ description: 'The ending coordinates (latitude,longitude)' })
  end: string;

  @ApiProperty({ description: 'The transport mode (driving, walking, cycling, transit)', required: false })
  mode?: string;
}