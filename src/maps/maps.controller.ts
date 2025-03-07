import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  ParseFloatPipe,
} from '@nestjs/common';
import { MapsService } from './maps.service';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  SearchLocationDto,
  GetDirectionsDto,
  NearbySearchDto,
  GeocodeDto,
  ReverseGeocodeDto,
  DistanceDto,
  AutocompleteDto,
  MultiModalDirectionsDto,
  RoutePoisDto,
  SearchHistoryDto,
  SpeedLimitsDto,
  TrafficDto,
} from './dto';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for a location' })
  @ApiQuery({ name: 'query', type: String, required: true })
  @ApiResponse({ status: 200, description: 'Location found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async searchLocation(@Query() searchLocationDto: SearchLocationDto) {
    const { query } = searchLocationDto;
    if (!query) throw new BadRequestException('Query parameter is required');
    return this.mapsService.searchLocation(query);
  }

  @Get('directions')
  @ApiOperation({ summary: 'Get directions between two points' })
  @ApiQuery({ name: 'start', type: String, required: true })
  @ApiQuery({ name: 'end', type: String, required: true })
  @ApiResponse({ status: 200, description: 'Directions found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Directions not found' })
  async getDirections(@Query() getDirectionsDto: GetDirectionsDto) {
    const { start, end } = getDirectionsDto;
    if (!start || !end) throw new BadRequestException('Start and end parameters are required');
    return this.mapsService.getDirections(start, end);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find places nearby a location' })
  @ApiQuery({ name: 'location', type: String, required: true })
  @ApiQuery({ name: 'radius', type: Number, required: false })
  @ApiQuery({ name: 'type', type: String, required: false })
  async findNearbyPlaces(@Query() nearbySearchDto: NearbySearchDto) {
    const { location, radius, type } = nearbySearchDto;
    return this.mapsService.findNearbyPlaces(location, radius, type);
  }

  @Get('geocode')
  @ApiOperation({ summary: 'Convert an address to coordinates' })
  @ApiQuery({ name: 'address', type: String, required: true })
  async geocode(@Query() geocodeDto: GeocodeDto) {
    const { address } = geocodeDto;
    return this.mapsService.geocode(address);
  }

  @Get('reverse-geocode')
@ApiOperation({ summary: 'Convert coordinates to an address' })
@ApiQuery({ name: 'lat', type: Number, required: true })
@ApiQuery({ name: 'lng', type: Number, required: true })
async reverseGeocode(
  @Query('lat', ParseFloatPipe) lat: number,
  @Query('lng', ParseFloatPipe) lng: number,
) {
  return this.mapsService.reverseGeocode([lng, lat]); // Format correct : [longitude, latitude]
}

  @Get('distance')
  @ApiOperation({ summary: 'Calculate distance between two points' })
  @ApiQuery({ name: 'start', type: String, required: true })
  @ApiQuery({ name: 'end', type: String, required: true })
  async calculateDistance(@Query() distanceDto: DistanceDto) {
    const { start, end } = distanceDto;
    return this.mapsService.calculateDistance(start, end);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiQuery({ name: 'query', type: String, required: true })
  @ApiQuery({ name: 'location', type: String, required: false })
  async autocomplete(@Query() autocompleteDto: AutocompleteDto) {
    const { query, location } = autocompleteDto;
    return this.mapsService.autocomplete(query, location);
  }

  @Get('directions/multi-modal')
  @ApiOperation({ summary: 'Get directions for different transport modes' })
  @ApiQuery({ name: 'start', type: String, required: true })
  @ApiQuery({ name: 'end', type: String, required: true })
  @ApiQuery({ name: 'mode', type: String, required: false })
  async getMultiModalDirections(@Query() multiModalDirectionsDto: MultiModalDirectionsDto) {
    const { start, end, mode } = multiModalDirectionsDto;
    return this.mapsService.getMultiModalDirections(start, end, mode);
  }
  @Get('route-pois')
  @ApiOperation({ summary: 'Find points of interest along a route' })
  @ApiQuery({ name: 'start', type: String, required: true })
  @ApiQuery({ name: 'end', type: String, required: true })
  @ApiQuery({ name: 'type', type: String, required: false })
  async findRoutePOIs(@Query() routePoisDto: RoutePoisDto) {
    const { start, end, type } = routePoisDto;
    return this.mapsService.findRoutePOIs(start, end, type);
  }

  @Get('search-history')
  @ApiOperation({ summary: 'Get search history for a user' })
  @ApiQuery({ name: 'userId', type: String, required: true })
  async getSearchHistory(@Query() searchHistoryDto: SearchHistoryDto) {
    const { userId } = searchHistoryDto;
    return this.mapsService.getSearchHistory(userId);
  }


  @Get('speed-limits')
  @ApiOperation({ summary: 'Get speed limits and hazard zones for a route' })
  @ApiQuery({ name: 'start', type: String, required: true })
  @ApiQuery({ name: 'end', type: String, required: true })
  async getSpeedLimits(@Query() speedLimitsDto: SpeedLimitsDto) {
    const { start, end } = speedLimitsDto;
    return this.mapsService.getSpeedLimits(start, end);
  }

  @Get('traffic')
  @ApiOperation({ summary: 'Get real-time traffic conditions for a route' })
  @ApiQuery({ name: 'start', type: String, required: true })
  @ApiQuery({ name: 'end', type: String, required: true })
  async getTrafficConditions(@Query() trafficDto: TrafficDto) {
    const { start, end } = trafficDto;
    return this.mapsService.getTrafficConditions(start, end);
  }
}