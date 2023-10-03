import { SequenceType } from "./sequence-type";

export interface Payment {
    amount: Amount;
    description: string;
    redirectUrl: string;
    cancelUrl: string;
    webhookUrl?: string;
    sequenceType?: SequenceType;
}

export interface Amount {
    currency: string;
    value: string;
}
    