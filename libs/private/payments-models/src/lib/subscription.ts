import { Amount } from "./payment";
import { PaymentMethod } from "./payment-method";

export interface Subscription {
    amount: Amount
    interval: string;
    times?: number
    description: string;
    method: PaymentMethod;
}
