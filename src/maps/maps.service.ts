import { Injectable } from '@nestjs/common';
import * as mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mbxDirections from '@mapbox/mapbox-sdk/services/directions';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import fetch from 'node-fetch';
import * as polyline from '@mapbox/polyline';

@Injectable()
export class MapsService {
  private geocodingClient;
  private directionsClient;

  constructor(private configService: ConfigService) {
    const mapboxAccessToken = this.configService.get<string>('MAPBOX_ACCESS_TOKEN');
    this.geocodingClient = mbxGeocoding({ accessToken: mapboxAccessToken });
    this.directionsClient = mbxDirections({ accessToken: mapboxAccessToken });
  }

  async searchLocation(query: string): Promise<any> {
    const response = await this.geocodingClient
      .forwardGeocode({ query, limit: 1 })
      .send();
    return response.body;
  }

  async getDirections(start: string, end: string): Promise<any> {
    try {
      const response = await this.directionsClient
        .getDirections({
          waypoints: [
            { coordinates: start.split(',').map(Number) as [number, number] },
            { coordinates: end.split(',').map(Number) as [number, number] },
          ],
          profile: 'driving',
        })
        .send();
  
      // Vérifier que la réponse est valide
      if (!response.body || !response.body.routes || response.body.routes.length === 0) {
        throw new Error('No valid route found');
      }
  
      return response.body;
    } catch (error) {
      console.error('Error in getDirections:', error);
      throw new Error('Failed to get directions');
    }
  }
  async findNearbyPlaces(location: string, radius: number, type?: string): Promise<any> {
    try {
      const [lng, lat] = location.split(',').map(Number);
      const response = await this.geocodingClient
        .reverseGeocode({
          query: [lng, lat],
          limit: 10,
          types: ['poi'], // Utilisez 'poi' pour les points d'intérêt
        })
        .send();
  
      // Filtrer les résultats pour ne retourner que les restaurants (si nécessaire)
      const places = response.body.features.filter((feature) => {
        return feature.properties.category === type; // Exemple : 'restaurant'
      });
  
      return {
        type: 'FeatureCollection',
        features: places,
      };
    } catch (error) {
      console.error('Error in findNearbyPlaces:', error);
      throw new Error('Failed to fetch nearby places');
    }
  }
  async geocode(address: string): Promise<any> {
    const response = await this.geocodingClient
      .forwardGeocode({ query: address, limit: 1 })
      .send();
    return response.body;
  }

  async reverseGeocode(coords: [number, number]): Promise<any> {
    try {
      const [lng, lat] = coords; // Assurez-vous que coords est un tableau de deux nombres
      const response = await this.geocodingClient
        .reverseGeocode({
          query: [lng, lat], // Format correct : [longitude, latitude]
        })
        .send();
      return response.body;
    } catch (error) {
      console.error('Error in reverseGeocode:', error);
      throw new Error('Failed to reverse geocode');
    }
  }
  async calculateDistance(start: string, end: string): Promise<number> {
    const directions = await this.getDirections(start, end);
    return directions.routes[0].distance; // Distance in meters
  }

  async autocomplete(query: string, location?: string): Promise<any> {
    const response = await this.geocodingClient
      .forwardGeocode({
        query,
        limit: 5,
        proximity: location ? location.split(',').map(Number) as [number, number] : undefined,
      })
      .send();
    return response.body;
  }

  async getMultiModalDirections(start: string, end: string, mode: string): Promise<any> {
    const response = await this.directionsClient
      .getDirections({
        waypoints: [
          { coordinates: start.split(',').map(Number) as [number, number] },
          { coordinates: end.split(',').map(Number) as [number, number] },
        ],
        profile: mode,
      })
      .send();
    return response.body;
  }

  

  async findRoutePOIs(start: string, end: string, type?: string): Promise<any> {
    try {
      const directions = await this.getDirections(start, end);
  
      // Vérifier que la réponse est valide
      if (!directions || !directions.routes || directions.routes.length === 0) {
        throw new Error('No valid route found');
      }
  
      const route = directions.routes[0];
  
      // Vérifier que la géométrie est valide
      if (!route.geometry) {
        throw new Error('Invalid geometry format');
      }
  
      // Décoder la géométrie polyline
      const waypoints = polyline.decode(route.geometry);
  
      const pois = await Promise.all(
        waypoints.map(async (coords) => {
          const response = await this.geocodingClient
            .reverseGeocode({
              query: coords,
              limit: 1,
              types: ['poi'], // Utilisez 'poi' pour les points d'intérêt
            })
            .send();
  
          // Filtrer les résultats pour ne retourner que les restaurants (si nécessaire)
          const filteredFeatures = response.body.features.filter((feature) => {
            return feature.properties.category === type; // Exemple : 'restaurant'
          });
  
          return {
            type: 'FeatureCollection',
            features: filteredFeatures,
          };
        }),
      );
  
      return pois;
    } catch (error) {
      console.error('Error in findRoutePOIs:', error);
      throw new Error('Failed to find route POIs');
    }
  }
  async getSearchHistory(userId: string): Promise<any> {
    // Implement logic to fetch search history
    return [];
  }

  
  async getSpeedLimits(start: string, end: string): Promise<any> {
    try {
      const directions = await this.getDirections(start, end);
  
      // Vérifier que la réponse est valide
      if (!directions || !directions.routes || directions.routes.length === 0) {
        throw new Error('No valid route found');
      }
  
      const route = directions.routes[0];
  
      // Vérifier que la géométrie est valide
      if (!route.geometry) {
        throw new Error('Invalid geometry format');
      }
  
      // Décoder la géométrie polyline
      const waypoints = polyline.decode(route.geometry);
      console.log('Waypoints:', waypoints); // Debug: Vérifiez les coordonnées
  
      // Prendre le premier point de l'itinéraire pour la recherche
      const [lng, lat] = waypoints[0];
  
      // Requête Overpass pour les limites de vitesse autour du point
      const overpassQuery = `
        [out:json];
        way[maxspeed](around:5000, ${lat}, ${lng});
        out body;
        >;
        out skel qt;
      `;
  
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  
      const response = await axios.get(overpassUrl);
      const speedLimits = response.data.elements
        .filter((element) => element.tags && element.tags.maxspeed)
        .map((element) => ({
          id: element.id,
          maxspeed: element.tags.maxspeed,
          coordinates: element.geometry ? element.geometry.map((point) => [point.lat, point.lon]) : [],
        }));
  
      return speedLimits;
    } catch (error) {
      console.error('Error in getSpeedLimits:', error);
      throw new Error('Failed to fetch speed limits from OpenStreetMap');
    }
  }
  async getTrafficConditions(start: string, end: string): Promise<any> {
    const response = await this.directionsClient
      .getDirections({
        waypoints: [
          { coordinates: start.split(',').map(Number) as [number, number] },
          { coordinates: end.split(',').map(Number) as [number, number] },
        ],
        profile: 'driving-traffic',
      })
      .send();
    return response.body;
  }
}