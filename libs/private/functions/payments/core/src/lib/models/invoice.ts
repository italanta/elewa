import { IObject } from "@iote/bricks";
import { Amount } from "./payment";

export interface Invoice extends IObject {
    date: Date;
    description: string;
    amount: Amount;
    orgId: string;
}