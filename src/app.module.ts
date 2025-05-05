import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiculeModule } from './vehicule/vehicule.module';
import { InfractionModule } from './infraction/infraction.module';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { MapsModule } from './maps/maps.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [
    UserModule,
    FirebaseModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    VehiculeModule,
    InfractionModule,
    MailModule,
    SmsModule,
    MapsModule,
    BlockchainModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
