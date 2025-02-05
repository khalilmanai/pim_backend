import { Controller, Post, Body } from '@nestjs/common';
import { ThirdPartyAuthService } from './third-party-auth/third-party.auth';
import { AuthService } from './auth.service';
import { ThirdPartySigninDto } from 'src/user/user-dto/third-party-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly thirdPartyAuthService: ThirdPartyAuthService,
  ) {}

  /**
   * Sign in with Google.
   */
  @Post('google')
  async googleSignIn(@Body() thirdPartySigninDto: ThirdPartySigninDto) {
    const { token } = thirdPartySigninDto;
    const profile = await this.thirdPartyAuthService.verifyGoogleToken(token);
    return this.authService.thirdPartySignIn('google', profile);
  }

  /**
   * Sign in with Facebook.
   */
  @Post('facebook')
  async facebookSignIn(@Body() thirdPartySigninDto: ThirdPartySigninDto) {
    const { token } = thirdPartySigninDto;
    const profile = await this.thirdPartyAuthService.verifyFacebookToken(token);
    return this.authService.thirdPartySignIn('facebook', profile);
  }

  /**
   * Sign in with Apple.
   */
  @Post('apple')
  async appleSignIn(@Body() thirdPartySigninDto: ThirdPartySigninDto) {
    const { token } = thirdPartySigninDto;
    const profile = await this.thirdPartyAuthService.verifyAppleToken(token);
    return this.authService.thirdPartySignIn('apple', profile);
  }
}
