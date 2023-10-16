import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import createMollieClient from '@mollie/api-client';

import { iTalUser } from "@app/model/user";
import { Payment } from "../models/payment";
import { Subscription } from "../models/subscription";

import { MollieCustomerService } from "../services/customer-core-service";
import { PaymentCoreService } from "../services/payment-core.service";
import { SubscriptionService } from "../services/subscription-core.service";
import { environment } from "../../environments/environment";


export class ReceivePaymentHandler extends FunctionHandler<any, any>
{
  private tools: HandlerTools;
  private _paymentService: PaymentCoreService;
  private _subscriptionService: SubscriptionService;
  private mollieCustomerService: MollieCustomerService
  private iTalUser: iTalUser


  mollieClient = createMollieClient({ apiKey: environment.mollieApiKey }); 
  public async execute(data: {orgId: string, subscription: Subscription}, context: FunctionContext, tools: HandlerTools): Promise<any> {
    /**
     * The webhook that is sent to mollie so as to update on payment status.
     */
    try {
      const webhookData = await this.getPaymentStatus(data.orgId)
    //mapping only the data that we need     
      const updatedWebhookData = {
        transactionStatus: webhookData.status,
        paidOn: webhookData.paidAt,
        sequenceType: webhookData.sequenceType,
        mandateId: webhookData.mandateId,
        description: webhookData.description,
        transactionId: webhookData.transactionId
      }
      // Write the updated webhook data to Firebase
    const subscriptionRepo = tools.getRepository<Subscription>(`orgs/${data.orgId}/transactions`);
    await subscriptionRepo.write(updatedWebhookData as unknown as Subscription, updatedWebhookData.transactionId);

      return { updatedWebhookData };
    } catch (e) {
      tools.Logger.log(() => `${e.message}`);
    }
    
    tools.Logger.log(() => `Payment Object ${JSON.stringify(data)}`);
  }
  async getPaymentStatus(paymentId: string){
    const molliePaymentStatus = await this.mollieClient.payments.get(paymentId)
    return {
      status: molliePaymentStatus.status,
      sequenceType: molliePaymentStatus.sequenceType,
      mandateId: molliePaymentStatus.mandateId,
      paidAt: molliePaymentStatus.paidAt,
      description: molliePaymentStatus.description,
      transactionId: molliePaymentStatus.id
    }
  }
  
  async handlePaymentStatusChange(payment: Payment, mollieCustomerId: string){
    const molliePaymentStatus = await this.getPaymentStatus(payment.id);
    if (payment.sequenceType === 'firstPayment') {
      const mandate = await this.mollieCustomerService.getMandates(mollieCustomerId);
      // Update iTalUser with new mandate 
      return mandate
    }   
    // Update payment with status from webhook
    payment.status = molliePaymentStatus.status;
    payment.sequenceType = molliePaymentStatus.sequenceType;
    payment.description = molliePaymentStatus.description
  }
  
 }
/**
 * TIPS for webhooks
 * onPAYMENTRECEIVED METHOD TO GET Status of payment and sequence type
 * chech status if paid == 
 * if fail == ? :()
 * extra return field on Payment received return payment status, mandate, 
 * if first payment: sequencetyp == first, update mandate id (user iTal)
 * return customerID to get iTal user (QUERIES )
 * extra types: sequence type first 
 * Getting the iTal user, update mandateID: The array of mandates on the iTal docs
 */
/**if paying for recurring sbscription
 * update subscription details
 * 
 * 
 * HOW TO WRITE TO DB
 * get orgId: data.orgid and payment object is data.payment obj
 * payment repo
 */