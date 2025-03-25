import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Module({
  providers: [BlockchainService], // Register BlockchainService as a provider
  exports: [BlockchainService], // Export BlockchainService to make it available in other modules
})
export class BlockchainModule {}
