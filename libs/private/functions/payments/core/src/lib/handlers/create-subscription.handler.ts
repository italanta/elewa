import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import { iTalUser } from "@app/model/user";
import { Status, Subscription } from "../models/subscription";

import { MollieCustomerService } from "../services/customer-core-service";
import { SubscriptionService } from "../services/subscription-core.service";
import { environment } from "../../environments/environment";
import { Customer } from "../models/customer";


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
export class CreateSubscriptionsHandler extends FunctionHandler<Subscription, any> {
  private mollieClientService: MollieCustomerService;
  private subscriptionService: SubscriptionService;
  private iTalUser: iTalUser;
  private customer: Customer

  constructor() {
    super();
    this.mollieClientService = new MollieCustomerService(this.customer, environment.mollieApiKey);
    this.subscriptionService = new SubscriptionService();
  }
  
  public async execute(data: Subscription, context: FunctionContext, tools: HandlerTools): Promise<any> {
    
    try {
        const subscription: Subscription = {
        ...data,
        interval: '12 months',
        status: Status.Pending,
        orgId: "",
        method: 'creditcard',
        webhookUrl: "https://europe-west1-elewa-clm-test.cloudfunctions.net/receivePayment",
        sequenceType: 'first',
        customerId: this.iTalUser.id
      };
        const customerExistsOnMollie = await this.mollieClientService.checkIfMollieCustomer(subscription.customerId);
    
        if (customerExistsOnMollie) {
          const hasMandate = await this.mollieClientService._getValidMandate(customerExistsOnMollie);
          const subDeets =  {amount: parseInt(subscription.amount.value), interval: subscription.interval}
          if (hasMandate) {
            const subscriptionResponse = await this.subscriptionService.createRecurringPayment(customerExistsOnMollie, hasMandate, subDeets);
    
            // Log the subscription response
            tools.Logger.log(() => `Subscription Created: ${JSON.stringify(subscriptionResponse)}`);
            await this.writeToFirebase(data.orgId, subscriptionResponse, tools);
    
            return subscriptionResponse;
          } else {
            // If the customer does not have a mandate, create the first payment and return a URL to complete it
            const firstPaymentUrl = await this.subscriptionService.createFirstPayment(subscription.customerId);
    
            tools.Logger.log(() => `First Payment URL: ${firstPaymentUrl}`);
    
            return firstPaymentUrl;
          }
        } else {
          const newCustomer = await this.mollieClientService.createMollieCustomer(this.iTalUser.id)
          return newCustomer
        }
      } catch (error) {
        // Handle any errors that occur during the process
        tools.Logger.log(() => `Subscription Creation Error: ${error}`);
        throw error;
      }
    }
    /** helper that writes the subscription data to Firebase*/
    private async writeToFirebase(orgId: string, subscriptionData: any, tools: HandlerTools): Promise<void> {
      const subscriptionRepo = tools.getRepository<Subscription>(`orgs/${orgId}/transactions`);
      await subscriptionRepo.write(subscriptionData as unknown as Subscription, subscriptionData.id);
      tools.Logger.log(() => `execute: Subscription Data Written to Firebase`);
    }
    
   }

