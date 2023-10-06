import { IObject } from "@iote/bricks";
import { Amount } from "./payment";

/**
 * Interval takes types monthy, weekly, yearly
 * @see https://docs.mollie.com/payments/recurring on how to handle recurring payments
 */
export interface Subscription extends IObject{
    status: string;
    amount:        Amount;
    interval:      string;
    times?:        number;
    description:   string;
    orgId:         string;
    startDate:     string;
    method:        string | string[]
}
 