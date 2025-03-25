import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('deploy')
  async deployContract() {
    try {
      const address = await this.blockchainService.deployContract();
      return { success: true, address };
    } catch (error) {
      throw new BadRequestException(
        `Failed to deploy contract: ${error.message}`,
      );
    }
  }

  @Post('infractions')
  async recordInfraction(
    @Body('infractionHash') infractionHash: string,
    @Body('vehiclePlate') vehiclePlate: string,
    @Body('infractionType') infractionType: string,
  ) {
    try {
      const tx = await this.blockchainService.recordInfraction(
        infractionHash,
        vehiclePlate,
        infractionType,
      );
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      throw new BadRequestException(
        `Failed to record infraction: ${error.message}`,
      );
    }
  }

  @Get('contract-address')
  async getContractAddress() {
    try {
      const address = await this.blockchainService.getContractAddress();
      return { success: true, address };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get contract address: ${error.message}`,
      );
    }
  }
}
