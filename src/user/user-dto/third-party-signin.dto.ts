import { IsNotEmpty, IsString } from 'class-validator';

export class ThirdPartySigninDto {
  @IsNotEmpty()
  @IsString()
  token: string; // Token provided by the third-party provider (Google/Facebook/Apple)
}
