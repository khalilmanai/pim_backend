import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapsService {
  constructor(private readonly httpService: HttpService, private configService: ConfigService) {}

  async getRoute(origin: string, destination: string) {
    const MAPBOX_API_KEY = this.configService.get<string>('MAPBOX_API_KEY');

    // Geocode the origin and destination to get their coordinates
    const geocodeOriginUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${MAPBOX_API_KEY}`;
    const geocodeDestinationUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${MAPBOX_API_KEY}`;

    try {
      // Fetch coordinates for both origin and destination
      const [originResponse, destinationResponse] = await Promise.all([
        firstValueFrom(this.httpService.get(geocodeOriginUrl)),
        firstValueFrom(this.httpService.get(geocodeDestinationUrl)),
      ]);

      // Get the coordinates from the response
      const originCoords = originResponse.data.features[0]?.geometry.coordinates;
      const destinationCoords = destinationResponse.data.features[0]?.geometry.coordinates;

      // Check if coordinates were found
      if (!originCoords || !destinationCoords) {
        throw new Error('Unable to geocode one of the locations.');
      }

      // Format the coordinates as longitude,latitude
      const originCoordStr = `${originCoords[0]},${originCoords[1]}`;
      const destinationCoordStr = `${destinationCoords[0]},${destinationCoords[1]}`;

      // Now use the Directions API to get the route
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordStr};${destinationCoordStr}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;
      const routeResponse = await firstValueFrom(this.httpService.get(directionsUrl));
      
      return routeResponse.data;
    } catch (error) {
      throw new Error(`Failed to fetch route: ${error.message}`);
    }
  }
}
