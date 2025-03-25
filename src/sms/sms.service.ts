import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;
  private otpStore = new Map<string, string>(); // Temporary storage

  constructor(private configService: ConfigService) {
    this.client = new twilio.Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  generateOtp(): string {
    return otpGenerator.generate(5, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }

  async sendOtp(to: string): Promise<string> {
    const otp = this.generateOtp();
    this.otpStore.set(to, otp); // Store OTP temporarily

    const message = await this.client.messages.create({
      body: `Your password reset OTP is: ${otp}`,
      messagingServiceSid: this.configService.get<string>(
        'TWILIO_MESSAGING_SERVICE_SID',
      ),
      to,
    });

    return message.sid;
  }

  verifyOtp(to: string, otp: string): boolean {
    const storedOtp = this.otpStore.get(to);
    if (storedOtp && storedOtp === otp) {
      this.otpStore.delete(to); // Remove OTP after verification
      return true;
    }
    return false;
  }
}
