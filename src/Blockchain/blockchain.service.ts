import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as solc from 'solc';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  public contract: ethers.Contract;
  private contractAddress: string;

  constructor() {
    // Initialize provider and signer
    this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    this.signer = new ethers.Wallet(
      '0x381c1cfa10264c6aed2327b5f8b1d8142e3814e1f046f677128886f225faa654', // Private key from Ganache
      this.provider,
    );
  }

  async onModuleInit() {
    await this.initializeContract();
  }

  private async initializeContract() {
    try {
      // Try to load existing deployment
      const deploymentInfo = JSON.parse(
        fs.readFileSync('contracts/InfractionContract.json', 'utf8'),
      );
      this.contractAddress = deploymentInfo.address;

      this.contract = new ethers.Contract(
        this.contractAddress,
        deploymentInfo.abi,
        this.signer,
      );
      this.logger.log(`Using existing contract at ${this.contractAddress}`);
    } catch (error) {
      // Deploy new contract if none exists
      this.logger.log('No existing contract found, deploying new...');
      await this.deployContract();
    }
  }

  private async compileContract() {
    const contractSource = fs.readFileSync(
      'src/Blockchain/contracts/InfractionContract.sol',
      'utf8',
    );

    const input = {
      language: 'Solidity',
      sources: { 'InfractionContract.sol': { content: contractSource } },
      settings: { outputSelection: { '*': { '*': ['*'] } } },
    };

    return JSON.parse(solc.compile(JSON.stringify(input)));
  }

  public async deployContract() {
    const output = await this.compileContract();
    const contractABI =
      output.contracts['InfractionContract.sol'].InfractionContract.abi;
    const bytecode =
      output.contracts['InfractionContract.sol'].InfractionContract.evm.bytecode
        .object;

    const factory = new ethers.ContractFactory(
      contractABI,
      bytecode,
      this.signer,
    );
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    this.contractAddress = await contract.getAddress();
    this.contract = contract as ethers.Contract;

    // Save deployment info
    fs.writeFileSync(
      'src/Blockchain/contracts/InfractionContract.json',
      JSON.stringify(
        {
          address: this.contractAddress,
          abi: contractABI,
          deployedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    this.logger.log(`Contract deployed to: ${this.contractAddress}`);
    return this.contractAddress;
  }

  async recordInfraction(
    infractionHash: string,
    vehiclePlate: string,
    infractionType: string,
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    return this.contract.recordInfraction(
      infractionHash,
      timestamp,
      vehiclePlate,
      infractionType,
    );
  }

  async getContractAddress(): Promise<string> {
    return this.contractAddress;
  }
}
