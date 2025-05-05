import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';

@Module({
  providers: [BlockchainService], // Register BlockchainService as a provider
  controllers: [BlockchainController], // No controllers are defined in this module
  exports: [BlockchainService], // Export BlockchainService to make it available in other modules
})
export class BlockchainModule {}
