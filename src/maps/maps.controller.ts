import { Controller, Get, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('geocode')
  async getGeocode(@Query('location') location: string) {
    return this.mapsService.getCoordinates(location);
  }
}
