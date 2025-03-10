import { Module } from '@nestjs/common';
import { InfractionService } from './infraction.service';
import { InfractionController } from './infraction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Infraction, InfractionSchema } from './schemas/infraction.schema';
import { VehiculeModule } from '../vehicule/vehicule.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Infraction.name, schema: InfractionSchema },
    ]),
    VehiculeModule,
  ],
  controllers: [InfractionController],
  providers: [InfractionService],
})
export class InfractionModule {}