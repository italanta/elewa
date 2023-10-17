import { HandlerTools } from '@iote/cqrs';
import { Transaction } from '../models/transaction';

/**
 * Service for managing transactions, including updating, retrieving, and writing transactions.
 */
export class TransactionsService {
  
  constructor(
    private tools: HandlerTools
  ) {}


  updateTransaction(trn: Transaction, userId: string) {
    const trnRepo = this.tools.getRepository<Transaction>(`users/${userId}/transactions`);

    return trnRepo.update(trn);
  }

  getTransaction(transactionId: string, userId: string) {
    const trnRepo = this.tools.getRepository<Transaction>(`users/${userId}/transactions`);

    return trnRepo.getDocumentById(transactionId);
  }

  writeTransaction(trn: Transaction, userId: string) {
    const trnRepo = this.tools.getRepository<Transaction>(`users/${userId}/transactions`);

    return trnRepo.write(trn, trn.id);
  }
}
