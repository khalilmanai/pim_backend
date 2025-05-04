import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InfractionService } from './infraction.service';
import { CreateInfractionDto } from './infraction-dto/createInfraction.dto';
import { NotificationGateway } from '../websocket/websocket.gateway';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('infractions')
@Controller('infraction')
export class InfractionController {
  constructor(
    private readonly infractionService: InfractionService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /*  @Post()
  async create(@Body() createInfractionDto: CreateInfractionDto) {
    return this.infractionService.createInfraction(createInfractionDto);
  } */

  @Post('simple')
  @ApiOperation({ summary: 'Create a new infraction' })
  @ApiResponse({ status: 201, description: 'The infraction has been successfully created.' })
  @ApiBody({ type: CreateInfractionDto })
  async createSimple(@Body() createInfractionDto: CreateInfractionDto) {
    return this.infractionService.createSimpleInfraction(createInfractionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all infractions' })
  @ApiResponse({ status: 200, description: 'Return all infractions.' })
  async findAll() {
    return this.infractionService.findAll();
  }

  @Get(':serie/:number')
  @ApiOperation({ summary: 'Get infractions by plate number' })
  @ApiResponse({ status: 200, description: 'Return infractions for the specified plate number.' })
  async findByPlate(
    @Param('serie') serie: string,
    @Param('number') number: string,
  ) {
    return this.infractionService.findByPlate(serie, number);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get infractions by user ID' })
  @ApiResponse({ status: 200, description: 'Return infractions for the specified user.' })
  async findById(@Param('id') id: string) {
    // Add the findById method
    return this.infractionService.findByUserId(id);
  }

  @Post('test-notification')
  async testNotification(@Body() body: { fcmToken: string, message: string }) {
    return this.infractionService.sendTestNotification(body.fcmToken, body.message);
  }

  @Post('test-ws-notification')
  @ApiOperation({ summary: 'Test WebSocket notification' })
  @ApiResponse({ status: 200, description: 'Test notification sent successfully.' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user to send the notification to'
        }
      }
    }
  })
  async testWebSocketNotification(@Body() body: { userId: string }) {
    const notification = {
      type: 'infraction',
      message: 'Test notification from backend',
      timestamp: new Date(),
      testData: 'This is a test message'
    };
    
    await this.notificationGateway.sendNotificationToUser(body.userId, notification);
    return { message: 'Test notification sent' };
  }
}
