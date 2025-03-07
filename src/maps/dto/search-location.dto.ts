import { ApiProperty } from '@nestjs/swagger';

export class SearchLocationDto {
  @ApiProperty({ description: 'The search query for the location' })
  query: string;
}