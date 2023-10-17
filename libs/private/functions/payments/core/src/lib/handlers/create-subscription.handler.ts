import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import { iTalUser } from "@app/model/user";
import { Customer } from "../models/customer";
import { SubscriptionReq } from "../models/subscription-request.model";

import { MollieCustomerService } from "../services/customer-core-service";
import { SubscriptionService } from "../services/subscription-core.service";

import { TransactionsService } from "../services/transaction.service";
import { Transaction, TransactionStatus } from "../models/transaction";



    //webhook works for subscriptions
    /*
    receive a user id and sub details as typed by clm f.e
    returns a url to complete the first payment or success status.active ie subscription object from mollie

    what it should do
    check if cx is on mollie, (using the mollieCustomerService)
    check if cx has mandate if not create first payment and return url to complete the payment
    if mandate, create subscription
    return sub object Reagan will know what to do
    */

    /**
     * provide webhook url on first payment request, help in getting a confirmation for a successful payment 
     * if you get mollie payment object... Yaay
     */
export class CreateSubscriptionsHandler extends FunctionHandler<SubscriptionReq, any> {
  private mollieCustomerService: MollieCustomerService;
  private subscriptionService: SubscriptionService;
  private iTalUser: iTalUser;
  private customer: Customer;
  private _trnService: TransactionsService;
  private mollieCustomerId: string;
  
  async execute(data: SubscriptionReq, context: FunctionContext, tools: HandlerTools): Promise<any> {

    tools.Logger.log(()=> `[CreateSubscriptionsHandler].execute - Payload :: ${JSON.stringify(data)}`);

    this.mollieCustomerService = new MollieCustomerService(this.customer, process.env.MOLLIE_API_KEY, tools);
    this.subscriptionService = new SubscriptionService(tools);
    this._trnService  = new TransactionsService(tools);

    // Get user details
    this.iTalUser = await this.mollieCustomerService.getUser(data.userId)

    this.mollieCustomerId = this.iTalUser.mollieCustomerId;
    
    try {
        // If the customer is not on mollie, we create them and update the user object with the 
        //  mollie customer id
        if(!this.mollieCustomerId) {
          const mollieCustomerId = await this.mollieCustomerService.createMollieCustomer(this.iTalUser);

          this.mollieCustomerId = mollieCustomerId;
          this.iTalUser.mollieCustomerId = mollieCustomerId;

          await this.mollieCustomerService.updateUser(this.iTalUser);
        } 
    
          const hasMandate = await this.mollieCustomerService._getValidMandate(this.iTalUser);
          const subDetails =  {amount: data.amount.value, interval: data.interval}
          if (hasMandate) {
            const subscriptionResponse = await this.subscriptionService.createRecurringPayment(this.mollieCustomerId, hasMandate, subDetails);
    
            // Log the subscription response
            tools.Logger.log(() => `Subscription Created: ${JSON.stringify(subscriptionResponse)}`);

            const trn: Transaction = {
              id: subscriptionResponse.id,
              amount: data.amount.value,
              orgId: this.iTalUser.activeOrg,
              date: new Date(),
              status: TransactionStatus.pending
            }
            await this._trnService.writeTransaction(trn, this.iTalUser.id)

            return this.subscriptionService.initSubscription(subscriptionResponse, data.subscriptionType, this.iTalUser.activeOrg);
    
          } else {
            // If the customer does not have a mandate, create the first payment and return a URL to complete it
            const firstPaymentUrl = await this.subscriptionService.createFirstPayment(data.userId);
    
            tools.Logger.log(() => `First Payment URL: ${firstPaymentUrl}`);
    
            return firstPaymentUrl;
          }
      } catch (error) {
        // Handle any errors that occur during the process
        tools.Logger.log(() => `Subscription Creation Error: ${error}`);
        throw error;
      }
    }
   }

