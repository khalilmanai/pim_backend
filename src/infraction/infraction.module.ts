import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfractionService } from './infraction.service';
import { InfractionController } from './infraction.controller';
import {
  Infraction,
  InfractionSchema,
} from './infraction-schema/infractionSchema';
import { BlockchainModule } from '../blockchain/blockchain.module'; // Import BlockchainModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Infraction.name, schema: InfractionSchema },
    ]),
  ],
  controllers: [InfractionController],
  providers: [InfractionService],
})
export class InfractionModule {}
