import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private otpStore = new Map<string, string>(); // Store OTP temporarily (Use a database in production)

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: parseInt(this.configService.get<string>('EMAIL_PORT'), 10),
      secure: this.configService.get<string>('EMAIL_SECURE') === 'true', // Convertir string en boolean
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
    
  }

  // Generate a 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via email
  async sendOTP(email: string): Promise<void> {
  const user = await this.userService.findUserByEmail(email);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const otp = this.generateOTP();
  this.otpStore.set(email, otp); // Stocker OTP temporairement

  const mailOptions = {
    from: this.configService.get<string>('EMAIL_USER'), // Corrigé : c'était MAIL_USER au lieu de EMAIL_USER
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <b>${otp}</b></p>`,
  };

  try {
    const info = await this.transporter.sendMail(mailOptions);
    console.log('Email sent:', info); // 🔥 Log pour vérifier si l'email est envoyé
  } catch (error) {
    console.error('Error sending email:', error); // 🔥 Log en cas d'erreur
  }
}


  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = this.otpStore.get(email);
    if (storedOTP === otp) {
      this.otpStore.delete(email); // Remove OTP after verification
      return true;
    }
    return false;
  }

  // Reset password after OTP verification
  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    await this.userService.updatePassword(email, newPassword);
    return true;
  }
}
