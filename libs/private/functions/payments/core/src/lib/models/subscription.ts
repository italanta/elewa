import { Amount } from "./payment";

/**
 * Interval takes types monthy, weekly, yearly
 * @see https://docs.mollie.com/payments/recurring on how to handle recurring payments
 */
export interface Subscription {
    amount:        Amount;
    interval:      string;
    times?:        number
    description:   string;
}
 