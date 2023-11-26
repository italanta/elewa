import axios from "axios";
 
import { createMollieClient } from '@mollie/api-client';

import { HandlerTools } from '@iote/cqrs';

export class MollieCustomerService 
{
    private mollieClient;
    private _apiKey: string;

    constructor(
        private tools: HandlerTools
    ){
        this._apiKey = process.env.MOLLIE_API_KEY as string;
        this.mollieClient = createMollieClient({apiKey: this._apiKey});
        this.tools = tools;
    }
    /**
    * Create a Mollie customer using user information.
    */

    async createMollieCustomer (user: iTalUser){

    }

}