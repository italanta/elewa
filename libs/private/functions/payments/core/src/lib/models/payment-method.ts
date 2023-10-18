/**
 * various payments methods available, working with cards for now.
 * metadata is typed as any, will be determined as project moves on
 */
export interface PaymentMethod {
    paymentType:    PaymentType
    metadata:       any;
}

export enum PaymentType {
    debitCard = 1,
    creditCard  = 2,
    mPesa = 3
}
