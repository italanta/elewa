export interface PaymentMethod {
    paymentType:    PaymentType
    metadata:       any;
}

export enum PaymentType {
    debitCard = 1,
    creditCard  = 2,
    mPesa = 3
}