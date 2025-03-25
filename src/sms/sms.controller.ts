import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SmsService } from '../sms/sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('request-otp')
  async requestOtp(@Body('phone') phone: string) {
    if (!phone) throw new BadRequestException('Phone number is required');

    await this.smsService.sendOtp(phone);
    return { message: 'OTP sent successfully!' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    if (!phone || !otp)
      throw new BadRequestException('Phone and OTP are required');

    const isValid = this.smsService.verifyOtp(phone, otp);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    return {
      message: 'OTP verified successfully! You can reset your password.',
    };
  }
}
