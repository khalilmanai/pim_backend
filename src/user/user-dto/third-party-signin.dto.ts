import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ThirdPartySigninDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'OAuth token from Google/Facebook/Apple',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
