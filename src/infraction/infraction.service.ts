import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Infraction } from './infraction-schema/infractionSchema';
import { CreateInfractionDto } from './infraction-dto/createInfraction.dto';
import { User } from '../user/user-schemas/user.schema';
import { NotificationGateway } from '../websocket/websocket.gateway';

@Injectable()
export class InfractionService {
  private readonly logger = new Logger(InfractionService.name);

  constructor(
    @InjectModel(Infraction.name)
    private readonly infractionModel: Model<Infraction>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly notificationGateway: NotificationGateway,
    // private readonly blockchainService: BlockchainService, // Inject BlockchainService
  ) {}

  async createSimpleInfraction(
    createInfractionDto: CreateInfractionDto, // Use the DTO
  ): Promise<Infraction> {
    const savedInfraction = await this.infractionModel.create(createInfractionDto); // Create the infraction
    
    // Send WebSocket notification if user is associated
    if (createInfractionDto.user) {
      const user = await this.userModel.findById(createInfractionDto.user);
      if (user) {
        const notification = {
          type: 'infraction',
          message: `New infraction detected: ${createInfractionDto.type}`,
          infractionId: savedInfraction._id,
          timestamp: new Date(),
          amount: createInfractionDto.amount,
          location: createInfractionDto.location
        };
        this.notificationGateway.sendNotificationToUser(user._id.toString(), notification);
      }
    }
    
    return savedInfraction;
  }

  async sendTestNotification(fcmToken: string, message: string): Promise<string> {
    const admin = require('firebase-admin');
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    }
    
    try {
      const response = await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: 'Infraction Notification',
          body: message
        }
      });
      
      this.logger.log(`Successfully sent notification to ${fcmToken}`);
      return `Notification sent successfully: ${response}`;
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  /*   
  async createInfraction(
    createInfractionDto: CreateInfractionDto,
  ): Promise<Infraction> {
    try {
      // Create a unique hash for the infraction
      const infractionHash = `${createInfractionDto.serie}-${createInfractionDto.number}`;

      // Use the actual vehicle plate and infraction type from the DTO
      const vehiclePlate = `${createInfractionDto.serie}-${createInfractionDto.number}`;
      const infractionType = createInfractionDto.type;

      // Record the infraction on the blockchain
      const tx = await this.blockchainService.recordInfraction(
        infractionHash,
        vehiclePlate,
        infractionType,
      );

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Access the contract directly from the blockchain service
      const contract = this.blockchainService.contract;

      // Get the event fragment for the 'InfractionRecorded' event
      const eventFragment = contract.interface.getEvent('InfractionRecorded');
      const eventTopic = eventFragment.topicHash; // Use topicHash instead of getEventTopic

      // Find the event log in the receipt
      const eventLog = receipt.logs.find((log) => log.topics[0] === eventTopic);

      if (!eventLog) {
        throw new Error(
          'InfractionRecorded event not found in transaction receipt',
        );
      }

      // Decode the event log
      const decodedEvent = contract.interface.decodeEventLog(
        eventFragment,
        eventLog.data,
        eventLog.topics,
      );

      // Destructure the event arguments
      const [id, , timestamp] = decodedEvent.args;

      // Save the infraction to the database
      const infraction = new this.infractionModel({
        ...createInfractionDto,
        blockchainId: Number(id), // Convert BigNumber to number
        date: new Date(Number(timestamp) * 1000), // Convert timestamp to Date
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
 */
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
