/**
* An object that will be used to initiate a payment request
* Use transaction status to update an organization's subscriptions
*/
export interface Transaction {
    // The payment id
    id: string;
   
    orgId: string;
    
    amount: string;
    date: Date;
    tokens?: string;
   
    status: TransactionStatus;
  }
   
  export enum TransactionStatus {
    pending = 1,
    success = 2,
    fail = 3,
  }