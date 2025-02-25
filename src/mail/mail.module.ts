import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule], 
  controllers: [MailController], // Assure-toi que MailController est bien déclaré ici
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
