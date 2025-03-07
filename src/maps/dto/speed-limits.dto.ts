import { ApiProperty } from '@nestjs/swagger';

export class SpeedLimitsDto {
  @ApiProperty({ description: 'The starting coordinates (latitude,longitude)' })
  start: string;

  @ApiProperty({ description: 'The ending coordinates (latitude,longitude)' })
  end: string;
}