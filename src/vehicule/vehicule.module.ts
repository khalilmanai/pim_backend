import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VehiculeService } from './vehicule.service';
import { VehiculeController } from './vehicule.controller';
import { Vehicule, VehiculeSchema } from './vehicule-schemas/vehicule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicule.name, schema: VehiculeSchema },
    ]),
  ],
  providers: [VehiculeService],
  controllers: [VehiculeController],
  exports: [VehiculeService],
})
export class VehiculeModule {}
