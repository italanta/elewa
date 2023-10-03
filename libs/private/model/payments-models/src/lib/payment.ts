import { SequenceType } from "./sequence-type";

/**
 * The payment object expected by Mollie API. 
 * Amount, description, redirect url, are compulsory. 
 */
export interface Payment {
    amount: Amount;
    description: string;
    redirectUrl: string;
    cancelUrl: string;
    webhookUrl?: string;
    sequenceType?: SequenceType;
}

/**
 * The amount object expected should have currency and value keys.
 * The value is a string of numbers without the thousand assertion ie 10000 != 10,000
 */
export interface Amount {
    currency: string;
    value: string;
}
    