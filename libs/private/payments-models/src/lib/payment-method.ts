export interface PaymentMethod {
    paymentType:    PaymentType
    metadata:       any;
}


export enum PaymentType {
    debitCard = 1,
    creditCard  = 2,
    mPesa = 3
}

/**comments  on type and params*/

//end point api/rcv payment 
//handler
//private/model/payments
