// src/maps/maps.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('search')
  async searchLocation(@Query('query') query: string) {
    if (!query) {
      throw new Error('Query parameter is required');
    }
    return this.mapsService.searchLocation(query);
  }

  @Get('directions')
  async getDirections(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    if (!start || !end) {
      throw new Error('Start and end parameters are required');
    }

    const startCoords = start.split(',').map(Number) as [number, number];
    const endCoords = end.split(',').map(Number) as [number, number];

    return this.mapsService.getDirections(startCoords, endCoords);
  }
}