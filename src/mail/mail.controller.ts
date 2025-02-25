import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // Endpoint to send OTP to the user's email
  @Post('send-otp')
  async sendOTP(@Body('email') email: string) {
    await this.mailService.sendOTP(email);
    return { message: `OTP sent to ${email}` };
  }

  // Endpoint to verify the OTP provided by the user
  @Post('verify-otp')
  async verifyOTP(@Body('email') email: string, @Body('otp') otp: string) {
    const isValid = await this.mailService.verifyOTP(email, otp);
    if (isValid) {
      return { message: 'OTP is valid. You can now reset your password.' };
    } else {
      return { message: 'Invalid OTP. Please try again.' };
    }
  }

  // Endpoint to reset the password after OTP verification
  @Post('reset-password')
  async resetPassword(@Body('email') email: string, @Body('newPassword') newPassword: string) {
    await this.mailService.resetPassword(email, newPassword);
    return { message: 'Password successfully reset' };
  }
}
