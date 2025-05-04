import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfractionController } from './infraction.controller';
import { InfractionService } from './infraction.service';
import { Infraction, InfractionSchema } from './infraction-schema/infractionSchema';
import { UserModule } from '../user/user.module';
import { VehiculeModule } from '../vehicule/vehicule.module';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { User, UserSchema } from '../user/user-schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Infraction.name, schema: InfractionSchema },
      { name: User.name, schema: UserSchema }
    ]),
    UserModule,
    VehiculeModule,
    MailModule,
    SmsModule,
    WebSocketModule,
  ],
  controllers: [InfractionController],
  providers: [InfractionService],
})
export class InfractionModule {}
