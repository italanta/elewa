import { IObject } from "@iote/bricks";

/**
 * The payment object expected by Mollie API. 
 * Amount, description, redirect url, are compulsory. 
 * Making method an optional param so that when a user is redirected to mollie, they can choose the method they prefer
 */
export interface Payment extends IObject{
    amount: Amount;
    description: string;
    redirectUrl: string;
    cancelUrl: string;
    webhookUrl?: string;
    sequenceType?: string;
    method? : string  
    customerId: string;
    status: string;
}

/**
 * The amount object expected should have currency and value keys.
 * The value is a string of numbers without the thousand assertion ie 10000 != 10,000
 */
export interface Amount {
    currency: string;
    value: string;
}
    