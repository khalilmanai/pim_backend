import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';  // Assure-toi que tu as un service User qui gère les utilisateurs

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,  // Assure-toi que UserService existe
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  // 1. Générer un token de réinitialisation
  async generateResetToken(email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = uuidv4();  // Créer un token unique
    // Sauvegarder ce token dans la base de données (avec une expiration, si nécessaire)
    await this.userService.saveResetToken(email, resetToken);
    return resetToken;
  }

  // 2. Envoyer le lien de réinitialisation de mot de passe par email
  async sendPasswordResetLink(email: string, resetToken: string): Promise<void> {
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;  // Change cette URL si nécessaire

    const mailOptions = {
      from: this.configService.get<string>('MAIL_USER'),
      to: email,
      subject: 'Password Reset Link',
      text: `You requested a password reset. Please click the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. Please click the following link to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // 3. Vérifier la validité du token de réinitialisation
  async verifyResetToken(resetToken: string): Promise<boolean> {
    // Vérifie dans la base de données si ce token est valide
    const user = await this.userService.findUserByResetToken(resetToken);
    return !!user;
  }

  // 4. Réinitialiser le mot de passe
  async resetPassword(resetToken: string, newPassword: string): Promise<boolean> {
    const user = await this.userService.findUserByResetToken(resetToken);
    if (!user) {
      throw new Error('Invalid reset token');
    }

    // Remplacer le mot de passe de l'utilisateur par le nouveau mot de passe
    await this.userService.updatePassword(user.email, newPassword);
    return true;
  }
}
