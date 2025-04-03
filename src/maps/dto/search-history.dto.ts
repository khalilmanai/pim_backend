import { ApiProperty } from '@nestjs/swagger';

export class SearchHistoryDto {
  @ApiProperty({ description: 'The user ID to fetch search history for' })
  userId: string;
}