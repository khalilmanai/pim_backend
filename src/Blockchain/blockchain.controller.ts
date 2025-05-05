import {
  Controller,
  Post,
  Body,
  Get,
  Param,
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

  @Get('infractions/:id')
  async getInfraction(@Param('id') id: string) {
    try {
      const parsedId = parseInt(id, 10); // Ensure it's a valid number
      if (isNaN(parsedId)) {
        throw new Error(`Invalid ID: ${id}`);
      }

      const result = await this.blockchainService.getInfraction(parsedId);

      if (
        !result ||
        result.infractionHash === '0x' ||
        result.infractionHash === ''
      ) {
        throw new Error(`No infraction found for ID: ${parsedId}`);
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch infraction: ${error.message}`,
      );
    }
  }

  @Get('infractionslist')
  async getAllInfractions() {
    try {
      const infractions = await this.blockchainService.getAllInfractions();
      return { success: true, data: infractions };
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch all infractions: ${error.message}`,
      );
    }
  }
}
