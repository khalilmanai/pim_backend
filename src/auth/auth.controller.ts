import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThirdPartyAuthService } from './third-party-auth/third-party.auth';
import { RegisterDto } from 'src/user/user-dto/register.dto';
import { LoginDto } from 'src/user/user-dto/login.dto';
import { ThirdPartySigninDto } from 'src/user/user-dto/third-party-signin.dto';
import { User } from 'src/user/user-schemas/user.schema';
import { ObjectId } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly thirdPartyAuthService: ThirdPartyAuthService,
  ) {}

  /**
   * Register a new user.
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
    return this.authService.register(registerDto);
  }

  /**
   * Log in a user.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ user: User }> {
    return this.authService.login(loginDto);
  }

  /**
   * Log out a user.
   */
  @Post('logout/:id')
  async logout(@Param('id') userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: 'Successfully logged out' };
  }

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
