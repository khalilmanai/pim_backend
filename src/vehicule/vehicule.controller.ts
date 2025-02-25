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


@Controller('vehicules')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  /**
   * POST /vehicules
   * Create a new vehicle.
   */
  @Post()
  async createVehicule(@Body() createVehiculeDto: any): Promise<Vehicule> {
    return this.vehiculeService.createVehicule(createVehiculeDto);
  }

  /**
   * GET /vehicules
   * Retrieve all vehicles.
   */
  @Get()
  async getAllVehicules(): Promise<Vehicule[]> {
    return this.vehiculeService.getAllVehicules();
  }

  /**
   * GET /vehicules/:id
   * Retrieve a vehicle by its ID.
   */
  @Get(':id')
  async getVehiculeById(@Param('id') id: string): Promise<Vehicule> {
    return this.vehiculeService.getVehiculeById(id);
  }

  /**
   * PUT /vehicules/:id
   * Update a vehicle by its ID.
   */
  @Put(':id')
  async updateVehicule(
    @Param('id') id: string,
    @Body() updateVehiculeDto: any,
  ): Promise<Vehicule> {
    return this.vehiculeService.updateVehicule(id, updateVehiculeDto);
  }

  /**
   * DELETE /vehicules/:id
   * Delete a vehicle by its ID.
   */
  @Delete(':id')
  async deleteVehicule(@Param('id') id: string): Promise<any> {
    return this.vehiculeService.deleteVehicule(id);
  }

  /**
   * GET /vehicules/plate/:plate
   * Retrieve a vehicle by its plate number.
   */
  @Get('plate/:plate')
  async getCarByPlateNumber(@Param('plate') plate: string): Promise<Vehicule> {
    return this.vehiculeService.getCarByPlateNumber(plate);
  }

  /**
   * GET /vehicules/plate/:plate/owner
   * Retrieve the owner of a vehicle by its plate number.
   */
  @Get('plate/:plate/owner')
  async getCarOwnerByPlateNumber(@Param('plate') plate: string): Promise<any> {
    return this.vehiculeService.getCarOwnerByPlateNumber(plate);
  }

  /**
   * PUT /vehicules/plate/:plate/owner
   * Update the owner of a vehicle by its plate number.
   * Body should include { newOwnerId: string }.
   */
  @Put('plate/:plate/owner')
  async updateCarOwner(
    @Param('plate') plate: string,
    @Body() updateDto: { newOwnerId: string },
  ): Promise<Vehicule> {
    return this.vehiculeService.updateCarOwner(plate, updateDto.newOwnerId);
  }
}
