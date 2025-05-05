import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { contractAddress } from '../../contract-address';

@Injectable()
export class ContractService implements OnModuleInit {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('RPC_URL')
    );
    
    const wallet = new ethers.Wallet(
      this.configService.get<string>('PRIVATE_KEY'),
      provider
    );
    // Load contract ABI and address
    const contractABI = require('../../artifacts/contracts/InfractionVerification.sol/InfractionVerification.json').abi;

    this.contract = new ethers.Contract(
      contractAddress,
      contractABI,
      wallet
    );
  }

  async verifyInfraction(infractionHash: string): Promise<boolean> {
    try {
      const result = await this.contract.verifyInfraction(infractionHash);
      return result;
    } catch (error) {
      console.error('Error verifying infraction:', error);
      throw error;
    }
  }

  async storeInfractionHash(infractionHash: string): Promise<string> {
    try {
      const tx = await this.contract.storeInfractionHash(infractionHash);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error storing infraction hash:', error);
      throw error;
    }
  }
} 