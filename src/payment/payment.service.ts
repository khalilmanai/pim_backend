import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from './payement-schema/payement.schema';
import { Infraction } from 'src/infraction/infraction-schema/infractionSchema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<Payment>,
    @InjectModel(Infraction.name)
    private infractionModel: Model<Infraction>,
  ) {}

  async createPayment(
    userId: string,
    infractionId: string,
    amount: number,
  ): Promise<{ payment: Payment; infraction: Infraction }> {
    // Validate infraction
    const infraction = await this.infractionModel.findById(infractionId);
    if (!infraction) {
      throw new NotFoundException('Infraction not found');
    }

    if (infraction.status === 'paid') {
      throw new BadRequestException('This infraction is already fully paid.');
    }

    const totalInfractionAmount = infraction.amount;
    const remainingAmount = infraction.remainingAmount ?? totalInfractionAmount;

    // Check minimum payment (30%)
    const minPayment = totalInfractionAmount * 0.3;
    if (remainingAmount < minPayment) {
      throw new BadRequestException(
        `Payment must be at least 30% (${minPayment.toFixed(2)} TND) of the infraction amount.`,
      );
    }

    // Prevent overpayment
    if (amount > remainingAmount) {
      throw new BadRequestException(
        `Payment amount (${amount.toFixed(2)} TND) exceeds the remaining amount (${remainingAmount.toFixed(2)} TND).`,
      );
    }

    // Generate receipt
    const paymentStatus = amount >= remainingAmount ? 'paid' : 'partial';
    const receipt = {
      receiptNumber: `RCPT-${Date.now()}`,
      userId,
      infractionId,
      amount,
      date: new Date(),
      status: paymentStatus,
      message:
        paymentStatus === 'paid'
          ? 'Payment completed.'
          : `Partial payment of ${amount.toFixed(2)} TND received.`,
    };

    // Create payment
    const payment = new this.paymentModel({
      userId: new Types.ObjectId(userId),
      infractionId: new Types.ObjectId(infractionId),
      amount,
      status: 'paid', // Payment itself is successful
      receipt,
    });
    await payment.save();

    // Update infraction
    const newRemainingAmount = remainingAmount - amount;
    infraction.remainingAmount = newRemainingAmount;
    infraction.status = newRemainingAmount === 0 ? 'paid' : 'unpaid';
    await infraction.save();

    return { payment, infraction };
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel
      .find()
      .populate('userId')
      .populate('infractionId')
      .exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findById(id)
      .populate('userId')
      .populate('infractionId')
      .exec();
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }
}
