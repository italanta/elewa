
import { HandlerTools } from '@iote/cqrs';
import { Transaction } from '../models/transaction';

export class TransactionsService {
  
  constructor(
    private tools: HandlerTools
  ) {}


  updateTransaction(trn: Transaction, userId: string) {
    const trnRepo = this.tools.getRepository<Transaction>(`users/${userId}/transactions`);

    return trnRepo.update(trn);
  }

  getTransaction(paymentId: string, userId: string) {
    const trnRepo = this.tools.getRepository<Transaction>(`users/${userId}/transactions`);

    return trnRepo.getDocumentById(paymentId);
  }

  writeTransaction(trn: Transaction, userId: string) {
    const trnRepo = this.tools.getRepository<Transaction>(`users/${userId}/transactions`);

    return trnRepo.write(trn, trn.id);
  }
}
