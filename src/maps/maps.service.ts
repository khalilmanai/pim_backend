import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MapsService {
  private readonly mapboxApiKey: string;
  private readonly mapboxBaseUrl: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor(private readonly configService: ConfigService) {
    this.mapboxApiKey = this.configService.get<string>('MAPBOX_API_KEY');
  }

  async getCoordinates(location: string): Promise<any> {
    try {
      const response = await axios.get(`${this.mapboxBaseUrl}/${encodeURIComponent(location)}.json`, {
        params: {
          access_token: this.mapboxApiKey,
          limit: 1,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des coordonnées : ${error.message}`);
    }
  }
}
