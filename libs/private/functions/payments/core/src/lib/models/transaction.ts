/**
 * An object that will be used to initiate a payment request 
 * Use transaction status to update an organization's subscriptions
 */
export interface Transaction {
    amount: string;
    date: string;
    tokens?: string;
    id: string;
    status: TransactionStatus
}

export enum TransactionStatus {
  pending = 1,
  success = 2,
  fail    = 3
}