//import { Payment } from ;
import { Payment } from "../models/payment";
import axios, {AxiosRequestHeaders} from 'axios';

export class PaymentCoreService {
    apiKey: string;
    paymentObject: Payment
    paymentURL: string;
    constructor(private _apiKey: string, private _paymentObject: Payment, private _paymentURL: string){
        this. apiKey = _apiKey;
        this._paymentObject = _paymentObject;
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
        const payment = await axios.post(`${this.paymentURL}/payments`, this.paymentObject)
        return payment.data;
    }
}