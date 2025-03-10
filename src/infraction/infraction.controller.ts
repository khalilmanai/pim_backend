import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { InfractionService } from './infraction.service';
import { VehiculeService } from '../vehicule/vehicule.service';
import { Infraction } from './schemas/infraction.schema';
import { CreateInfractionDto } from './dto/create-infraction.dto';
import { UpdateInfractionDto } from './dto/update-infraction.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('infractions')
@Controller('infractions')
export class InfractionController {
  constructor(
    private readonly infractionService: InfractionService,
    private readonly vehiculeService: VehiculeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new infraction' })
  async create(
    @Body() createInfractionDto: CreateInfractionDto,
  ): Promise<Infraction> {
    const vehicle = await this.vehiculeService.findByPlateSerieAndNumber(
      createInfractionDto.plateSerie,
      createInfractionDto.plateNumber,
    );

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Create a new object with the user field
    const infractionData = {
      ...createInfractionDto,
      user: vehicle.owner,
    };

    return this.infractionService.create(infractionData);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all infractions' })
  async findAll(): Promise<Infraction[]> {
    return this.infractionService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve all infractions by user ID' })
  async findAllByUser(@Param('userId') userId: string): Promise<Infraction[]> {
    return this.infractionService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an infraction by ID' })
  async findOne(@Param('id') id: string): Promise<Infraction> {
    return this.infractionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an infraction by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateInfractionDto: UpdateInfractionDto,
  ): Promise<Infraction> {
    let user: Types.ObjectId | undefined;

    if (updateInfractionDto.plateSerie || updateInfractionDto.plateNumber) {
      const vehicle = await this.vehiculeService.findByPlateSerieAndNumber(
        updateInfractionDto.plateSerie,
        updateInfractionDto.plateNumber,
      );

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      user = vehicle.owner;
    }

    // Create a new update object
    const updateData = {
      ...updateInfractionDto,
      ...(user && { user }), // Only add user if it exists
    };

    return this.infractionService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an infraction by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.infractionService.delete(id);
  }

  @Get('user/:userId/vehicles')
  @ApiOperation({ summary: 'Retrieve all vehicles for a user from infraction API' })
  async findUserVehicles(@Param('userId') userId: string) {
    const vehicles = await this.vehiculeService.findByUser(userId);
    if (!vehicles.length) {
      throw new NotFoundException('No vehicles found for this user');
    }
    return vehicles;
  }
}
