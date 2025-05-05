import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class TransactionsService {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3('http://127.0.0.1:8545'); // Ganache default port
  }

  async findAll(): Promise<any[]> {
    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      const transactions = [];

      // Fetch transactions from recent blocks (last 10 blocks)
      for (let i = blockNumber; i > Math.max(0, blockNumber - 10); i--) {
        const block = await this.web3.eth.getBlock(i, true);
        if (block && block.transactions) {
          block.transactions.forEach((tx) => {
            transactions.push({
              hash: tx.hash,
              gasUsed: tx.gas,
              blockNumber: tx.blockNumber,
              timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
            });
          });
        }
      }
      return transactions;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch transactions' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
