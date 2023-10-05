import { IObject } from "@iote/bricks";

export interface Invoice extends IObject{
    date: Date;
    description: string;
    amount: number
}