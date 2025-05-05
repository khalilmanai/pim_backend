import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Infraction } from './infraction-schema/infractionSchema';
import { CreateInfractionDto } from './infraction-dto/createInfraction.dto';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class InfractionService {
  private readonly logger = new Logger(InfractionService.name);

  constructor(
    @InjectModel(Infraction.name)
    private readonly infractionModel: Model<Infraction>,
    private readonly blockchainService: BlockchainService,
  ) {}

  async createSimpleInfraction(
    createInfractionDto: CreateInfractionDto,
  ): Promise<Infraction> {
    return this.infractionModel.create(createInfractionDto);
  }

  async createInfraction(
    createInfractionDto: CreateInfractionDto,
  ): Promise<Infraction> {
    try {
      const infractionHash = `${createInfractionDto.serie}-${createInfractionDto.number}`;
      const vehiclePlate = `${createInfractionDto.serie}-${createInfractionDto.number}`;
      const infractionType = createInfractionDto.type;

      const receipt = await this.blockchainService.recordInfraction(
        infractionHash,
        vehiclePlate,
        infractionType,
      );

      // Create infraction in MongoDB
      const infraction = new this.infractionModel({
        ...createInfractionDto,
        blockchainId: receipt.blockNumber, // Use block number as blockchain ID
        date: new Date(),
        user: createInfractionDto.user, // Ensure user field is included
      });

      const savedInfraction = await infraction.save();
      this.logger.log(`Infraction saved with ID: ${savedInfraction._id}`);

      return savedInfraction;
    } catch (error) {
      this.logger.error(
        `Failed to record infraction: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `Failed to record infraction: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  async findAll(): Promise<Infraction[]> {
    return this.infractionModel.find().populate('user').exec();
  }

  async findByUserId(userId: string): Promise<Infraction[]> {
    return this.infractionModel.find({ user: userId }).exec();
  }

  async findByPlate(serie: string, number: string): Promise<Infraction[]> {
    return this.infractionModel.find({ serie, number }).populate('user').exec();
  }
}
