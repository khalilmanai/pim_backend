import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import * as contractData from '../../contracts/InfractionContractDeployed.json';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  public contract: ethers.Contract;

  onModuleInit() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.signer = new ethers.Wallet(
      process.env.BLOCKCHAIN_PRIVATE_KEY,
      this.provider,
    );
    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractData.abi,
      this.signer,
    );
    this.logger.log(`Connected to contract at ${process.env.CONTRACT_ADDRESS}`);
  }

  async deployContract() {
    const factory = new ethers.ContractFactory(
      contractData.abi,
      contractData.bytecode,
      this.signer,
    );
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    this.logger.log(`Contract deployed to ${address}`);
    return address;
  }

  getContractAddress() {
    return process.env.CONTRACT_ADDRESS;
  }

  async recordInfraction(hash: string, plate: string, type: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const tx = await this.contract.recordInfraction(
      hash,
      timestamp,
      plate,
      type,
    );
    this.logger.log(`Sent tx: ${tx.hash}`);

    const receipt = await tx.wait();
    if (receipt.status !== 1) {
      throw new Error(`Transaction ${tx.hash} failed`);
    }

    this.logger.log(`Infraction recorded in block ${receipt.blockNumber}`);
    return receipt;
  }

  async getInfraction(id: number) {
    try {
      if (isNaN(id)) {
        throw new Error(`Invalid id: ${id}`);
      }

      const result = await this.contract.getInfraction(id);

      if (!result || result[0] === '0x' || result[0] === '') {
        throw new Error(`Infraction with ID ${id} does not exist`);
      }

      return {
        id,
        infractionHash: result[0],
        timestamp: Number(result[1]),
        vehiclePlate: result[2],
        infractionType: result[3],
      };
    } catch (error) {
      this.logger.error(
        `Error fetching infraction with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async getAllInfractions() {
    try {
      const count = await this.contract.infractions.length;
      const infractions = [];

      for (let i = 0; i < count; i++) {
        const inf = await this.getInfraction(i);
        infractions.push(inf);
      }
      return infractions;
    } catch (error) {
      this.logger.error(`Error fetching all infractions: ${error.message}`);
      throw new Error(`Failed to fetch all infractions`);
    }
  }
}
