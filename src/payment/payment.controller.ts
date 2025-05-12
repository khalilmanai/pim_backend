import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Payment } from './payement-schema/payement.schema';
import { Infraction } from 'src/infraction/infraction-schema/infractionSchema';
import { CreatePaymentDto } from './dto/create-payement.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new payment for an infraction' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    schema: {
      example: {
        payment: {
          _id: '6821ce370eda271ae29b47f8',
          userId: '67c3147151c553707aaf0d86',
          infractionId: '681be041dc66a6983144afb3',
          amount: 200,
          status: 'paid',
          receipt: {
            receiptNumber: 'RCPT-1698765432100',
            userId: '67c3147151c553707aaf0d86',
            infractionId: '681be041dc66a6983144afb3',
            amount: 200,
            date: '2025-05-12T10:32:23.474Z',
            status: 'partial',
            message: 'Partial payment of 200.00 TND received.',
          },
          createdAt: '2025-05-12T10:32:23.474Z',
          updatedAt: '2025-05-12T10:32:23.474Z',
          __v: 0,
        },
        infraction: {
          _id: '681be041dc66a6983144afb3',
          amount: 500,
          remainingAmount: 300,
          status: 'unpaid',
          type: 'speeding',
          serie: '123',
          number: '456',
          date: '2025-05-10T08:00:00.000Z',
          location: 'Tunis',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid payment amount or infraction already paid',
  })
  @ApiNotFoundResponse({ description: 'Infraction not found' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { userId, infractionId, amount } = createPaymentDto;
    return this.paymentService.createPayment(userId, infractionId, amount);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all payments' })
  @ApiResponse({
    status: 200,
    description: 'List of all payments',
    type: [Payment],
  })
  async findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment details',
    type: Payment,
  })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }
}
