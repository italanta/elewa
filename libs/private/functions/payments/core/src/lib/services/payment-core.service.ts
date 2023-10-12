
import { createMollieClient } from '@mollie/api-client';
import { HandlerTools } from "@iote/cqrs";
import axios, {AxiosRequestHeaders} from 'axios';

import { Payment } from "../models/payment"
import { MollieCustomerService } from './customer-core-service';
import {Customer} from '../models/customer'
import { iTalUser } from '@app/model/user';



// export class PaymentCoreService {
//     private mollieCustomerService: MollieCustomerService;

//     constructor(mollieCustomerService: MollieCustomerService) {
//       this.mollieCustomerService = mollieCustomerService;
//     }
//     apiKey: string;
//     paymentObject: any
//     paymentURL: string;

//     mollieClient;

//     constructor(private _apiKey: string, 
//                 private _paymentObject: any, 
//                 private _paymentURL: string,
//                 private tools: HandlerTools
//     ) {
//         this.apiKey = _apiKey;
//         this.paymentObject = _paymentObject;
//         this.paymentURL = _paymentURL;
//         this.mollieClient = createMollieClient({ apiKey: this._apiKey });
//     }

//     _buildHeaders(){
//         const headers : AxiosRequestHeaders= {
//             'Authorization': `Bearer ${this.apiKey}`
//         };
//         return headers;
//     }

//     async getPayment(id:string){
//         return await axios.get(`${this.paymentURL}/payments/${id}`);
//     }
//    //work on this 
//     async createPayment(){
//         this.tools.Logger.log(() => `PaymentCoreService : requestPayment`);
//         return await this.mollieClient.payments.create(this.paymentObject);
//     }

//     //get transaction id, then query it for payment data
//     async onPaymentReceived(payload: any){
//         await this.getPayment(payload.id)
//         this.tools.Logger.log(() => `PaymentCoreService: received a successful payment`);
//         const payment = await this.mollieClient.payments.get(payload.id)
//         return {paymentStatus: payment.status, sequenceType: payment.sequenceType}
//     }
//         /**
//          * TODO
//          */
//     private updateSubscription(){
//       //update status in db, aka handler ish
//       //get an internal subscription interface with sstatus which can be active, expired, cancelled
//       //definitely expiry and start date , dateType extends IObject
//       // subscription param: standard, premimum, enterprise enums of course
//       //orgs/id/subscriptions: DB path .... new doc, collection of documents
//     }
//}

export class PaymentsCoreService{
   mollieClient
    private mollieCustomerService: MollieCustomerService;

    constructor(mollieCustomerService: MollieCustomerService) {
      this.mollieCustomerService = mollieCustomerService;
      this.mollieClient = createMollieClient({ apiKey: apiKey});
//     }
    }

    /* Check if user is registered and get their valid mandates*/
    async createpayment(userId: string) {
    
        const validMandate = await this.mollieCustomerService._getValidMandate(userId);
        
        if (!validMandate) {
            throw new Error('No valid mandates found for this user.');
        }
    
        // Create the first payment for this user
        const payment = await this.mollieClient.payments.create({
            amount: { currency: 'EUR', value: '' }, 
            description: "My first API payment",
            redirectUrl: "https://webshop.example.org/order/12345/", 
            webhookUrl: "https://webshop.example.org/webhook/", 
            sequenceType: 'first',
            customerId: userId,
            mandateId: validMandate,
        });
    
        return payment;
    }
    

}