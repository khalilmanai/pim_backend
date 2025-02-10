import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // 1. Méthode pour envoyer un lien de réinitialisation de mot de passe
  @Post('send-password-reset')
  async sendPasswordResetLink(@Body('email') email: string) {
    const resetToken = await this.mailService.generateResetToken(email);
    await this.mailService.sendPasswordResetLink(email, resetToken);
    return { message: `Password reset link sent to ${email}` };
  }

  // 2. Méthode pour vérifier le token de réinitialisation (par exemple avant de changer le mot de passe)
  @Post('verify-reset-token')
  async verifyResetToken(@Body('resetToken') resetToken: string) {
    const isValid = await this.mailService.verifyResetToken(resetToken);
    if (isValid) {
      return { message: 'Reset token is valid' };
    } else {
      return { message: 'Invalid reset token' };
    }
  }

  // 3. Méthode pour réinitialiser le mot de passe de l'utilisateur
  @Post('reset-password')
  async resetPassword(@Body('resetToken') resetToken: string, @Body('newPassword') newPassword: string) {
    const isResetSuccessful = await this.mailService.resetPassword(resetToken, newPassword);
    if (isResetSuccessful) {
      return { message: 'Password successfully reset' };
    } else {
      return { message: 'Failed to reset password' };
    }
  }
}
