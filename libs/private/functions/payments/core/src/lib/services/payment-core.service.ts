//import { Payment } from ;
import { HandlerTools } from "@iote/cqrs";
import { Payment } from "../models/payment";
import axios, {AxiosRequestHeaders} from 'axios';

import { createMollieClient } from '@mollie/api-client';

export class PaymentCoreService {

    apiKey: string;
    paymentObject: any
    paymentURL: string;

    mollieClient = createMollieClient({ apiKey: this._apiKey });

    constructor(private _apiKey: string, 
                private _paymentObject: any, 
                private _paymentURL: string,
                private tools: HandlerTools
    ) {
        this.apiKey = _apiKey;
        this.paymentObject = _paymentObject;
        this.paymentURL = _paymentURL;
    }

    _buildHeaders(){
        const headers : AxiosRequestHeaders= {
            'Authorization': `Bearer ${this.apiKey}`
        };
        return headers;
    }

    async getPayment(id:string){
        return await axios.get(`${this.paymentURL}/payments/${id}`);
    }

    async requestPayment(){
        this.tools.Logger.log(() => `PaymentCoreService : requestPayment`);
        return await this.mollieClient.payments.create(this.paymentObject);
    }
}