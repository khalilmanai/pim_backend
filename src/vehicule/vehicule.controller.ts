import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { Vehicule } from './vehicule-schemas/vehicule.schema';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VehiculeDto } from './vehicule-dto/vehicule.dto';

@ApiTags('Vehicules')
@Controller('vehicules')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  /**
   * POST /vehicules
   * Create a new vehicle.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  async createVehicule(@Body() createVehiculeDto: VehiculeDto): Promise<Vehicule> {
    return this.vehiculeService.createVehicule(createVehiculeDto);
  }

  /**
   * GET /vehicules
   * Retrieve all vehicles.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all vehicles' })
  async getAllVehicules(): Promise<Vehicule[]> {
    return this.vehiculeService.getAllVehicules();
  }

  /**
   * GET /vehicules/:id
   * Retrieve a vehicle by its ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Update a vehicle by ID' })
  async getVehiculeById(@Param('id') id: string): Promise<Vehicule> {
    return this.vehiculeService.getVehiculeById(id);
  }

  /**
   * PUT /vehicules/:id
   * Update a vehicle by its ID.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a vehicle by ID' })
  async updateVehicule(
    @Param('id') id: string,
    @Body() updateVehiculeDto: VehiculeDto,
  ): Promise<Vehicule> {
    return this.vehiculeService.updateVehicule(id, updateVehiculeDto);
  }

  /**
   * DELETE /vehicules/:id
   * Delete a vehicle by its ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle by ID' })
  async deleteVehicule(@Param('id') id: string): Promise<any> {
    return this.vehiculeService.deleteVehicule(id);
  }

  /**
   * GET /vehicules/plate/:plate
   * Retrieve a vehicle by its plate number.
   */
  @Get('plate/:plate')
  @ApiOperation({ summary: 'Retrieve a vehicle by plate number' })
  async getCarByPlateNumber(@Param('plate') plate: string): Promise<Vehicule> {
    return this.vehiculeService.getCarByPlateNumber(plate);
  }

  /**
   * GET /vehicules/plate/:plate/owner
   * Retrieve the owner of a vehicle by its plate number.
   */
  @Get('plate/:plate/owner')
  @ApiOperation({
    summary: 'Retrieve the owner of a vehicle by its plate number'
  })
  async getCarOwnerByPlateNumber(@Param('plate') plate: string): Promise<any> {
    return this.vehiculeService.getCarOwnerByPlateNumber(plate);
  }

  /**
   * PUT /vehicules/plate/:plate/owner
   * Update the owner of a vehicle by its plate number.
   * Body should include { newOwnerId: string }.
   */
  @Put('plate/:plate/owner')
  @ApiOperation({
    summary: 'Update the owner of a vehicle by its plate number'
  })
  async updateCarOwner(
    @Param('plate') plate: string,
    @Body() updateDto: VehiculeDto,
  ): Promise<Vehicule> {
    return this.vehiculeService.updateCarOwner(plate, updateDto.owner);
  }
}
