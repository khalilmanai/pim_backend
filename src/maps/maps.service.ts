// src/maps/maps.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MapsService {
  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.mapbox.com';

  constructor(private configService: ConfigService) {
    this.accessToken = this.configService.get<string>('MAPBOX_ACCESS_TOKEN');
  }

  async searchLocation(query: string) {
    const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${this.accessToken}`;
    const response = await axios.get(url);
    return response.data.features;
  }

  async getDirections(start: [number, number], end: [number, number]) {
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    const url = `${this.baseUrl}/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${this.accessToken}`;
    const response = await axios.get(url);
    return response.data;
  }
}