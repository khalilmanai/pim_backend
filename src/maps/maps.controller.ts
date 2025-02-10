import { Controller, Get, Query } from '@nestjs/common';
import { MapsService } from './maps.service'; 

@Controller('maps') 
export class MapsController { 
  constructor(private readonly mapsService: MapsService) {} 
  @Get()
  async getRoute(@Query('origin') origin: string, @Query('destination') destination: string) {
    return this.mapsService.getRoute(origin, destination); 
  }
}
