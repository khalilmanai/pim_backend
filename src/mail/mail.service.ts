import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private otpStore = new Map<string, string>(); // Store OTP temporarily (Use a database in production)

  // HTML Template with {{otp}} placeholder for dynamic insertion
  htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Road Guard OTP</title>
    <style>
      /* Reset default styles */
      body,
      table,
      td,
      a {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
        line-height: 1.6;
      }
      /* Main container */
      .container {
        width: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); /* Gradient Black */
        padding: 40px 0;
      }
      .content {
        max-width: 650px;
        margin: 0 auto;
        background-color: #ffffff; /* White */
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }
      /* Header */
      .header {
        background: linear-gradient(90deg, #6b48ff, #8a6bff); /* Purple Gradient */
        padding: 25px;
        text-align: center;
        color: #ffffff;
        border-bottom: 4px solid #ffffff;
      }
      .header h1 {
        font-size: 28px;
        margin: 0;
        font-weight: 600;
        letter-spacing: 1px;
      }
      /* Body */
      .body {
        padding: 40px;
        color: #1a1a1a;
        text-align: center;
      }
      .body h2 {
        font-size: 22px;
        margin-bottom: 20px;
        color: #333333;
      }
      .otp-container {
        background-color: #f7f5ff; /* Light Purple */
        border: 2px dashed #6b48ff;
        border-radius: 8px;
        padding: 20px;
        margin: 25px 0;
      }
      .otp {
        font-size: 36px;
        font-weight: 700;
        color: #6b48ff;
        letter-spacing: 6px;
        text-transform: uppercase;
      }
      .instructions {
        font-size: 16px;
        color: #555555;
        line-height: 1.8;
      }
      .warning {
        font-size: 14px;
        color: #888888;
        margin-top: 15px;
      }
      /* Footer */
      .footer {
        background-color: #1a1a1a;
        color: #d9d9d9;
        text-align: center;
        padding: 20px;
        font-size: 13px;
      }
      .footer a {
        color: #8a6bff;
        text-decoration: none;
        font-weight: 500;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      /* Responsive Design */
      @media only screen and (max-width: 600px) {
        .content {
          width: 90%;
          margin: 0 10px;
        }
        .header h1 {
          font-size: 22px;
        }
        .body {
          padding: 20px;
        }
        .otp {
          font-size: 28px;
          letter-spacing: 4px;
        }
        .otp-container {
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <!-- Header -->
        <div class="header">
          <h1>Road Guard</h1>
        </div>
        <!-- Body -->
        <div class="body">
          <h2>Your One-Time Password (OTP)</h2>
          <p class="instructions">
            Please use the code below to verify your identity:
          </p>
          <div class="otp-container">
            <div class="otp">{{otp}}</div>
          </div>
          <p class="warning">
            This code is valid for 10 minutes. If you didn’t request this,
            please ignore this email or contact support.
          </p>
        </div>
        <!-- Footer -->
        <div class="footer">
          <p>© 2025 Road Guard. All rights reserved.</p>
          <p>
            <a href="#">Contact Us</a> | <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: parseInt(this.configService.get<string>('EMAIL_PORT'), 10),
      secure: this.configService.get<string>('EMAIL_SECURE') === 'true',
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
    this.otpStore.set(email, otp); // Store OTP temporarily

    // Replace {{otp}} placeholder with the actual OTP
    const htmlContent = this.htmlTemplate.replace('{{otp}}', otp);

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Road Guard - Your OTP Code',
      text: `A reset password request was received. Your OTP code is: ${otp}`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info);
    } catch (error) {
      console.error('Error sending email:', error);
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
