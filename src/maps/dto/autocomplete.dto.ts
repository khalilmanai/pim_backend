import { ApiProperty } from '@nestjs/swagger';

export class AutocompleteDto {
  @ApiProperty({ description: 'The partial search query' })
  query: string;

  @ApiProperty({ description: 'The location coordinates (latitude,longitude) for proximity bias', required: false })
  location?: string;
}