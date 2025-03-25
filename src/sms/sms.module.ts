import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Import ConfigModule for environment variables
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
