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
  ): Promise<Payment> {
    const infraction = await this.infractionModel.findById(infractionId);
    if (!infraction) throw new NotFoundException('Infraction not found');

    if (infraction.status === 'paid') {
      throw new BadRequestException('This infraction is already fully paid.');
    }

    const totalInfractionAmount = infraction.amount; // Assume infraction has an `amount` field
    const remainingAmount = infraction.remainingAmount ?? totalInfractionAmount;

    // ✅ Check minimum payment (30%)
    const minPayment = totalInfractionAmount * 0.3;
    if (amount < minPayment) {
      throw new BadRequestException(
        `Payment must be at least 30% (${minPayment}) of the infraction amount.`,
      );
    }

    // ✅ Prevent overpayment
    if (amount > remainingAmount) {
      throw new BadRequestException(
        `You are trying to pay more than the remaining amount (${remainingAmount}).`,
      );
    }

    // ✅ Generate receipt
    const receipt = {
      receiptNumber: `RCPT-${Date.now()}`,
      userId,
      infractionId,
      amount,
      date: new Date(),
      status: 'partial',
      message: `Partial payment of ${amount} received.`,
    };

    // ✅ Create payment
    const payment = new this.paymentModel({
      userId: new Types.ObjectId(userId),
      infractionId: new Types.ObjectId(infractionId),
      amount,
      status: 'paid', // Payment itself is paid
      receipt,
    });
    await payment.save();

    // ✅ Update infraction remaining amount
    const newRemainingAmount = remainingAmount - amount;

    if (newRemainingAmount == 0) {
      // Fully paid ✅
      infraction.status = 'paid';
      infraction.remainingAmount = 0;
    } else {
      // Still unpaid
      infraction.status = 'unpaid';
      infraction.remainingAmount = newRemainingAmount;
    }

    await infraction.save();

    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().populate('userId').populate('infractionId');
  }

  async findOne(id: string): Promise<Payment> {
    return this.paymentModel
      .findById(id)
      .populate('userId')
      .populate('infractionId');
  }
}
