import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { iTalUser } from "@app/model/user";
import { Transaction, TransactionStatus } from "../models/transaction";

import { MollieCustomerService } from "../services/customer-core-service";
import { PaymentCoreService } from "../services/payment-core.service";
import { SubscriptionService } from "../services/subscription-core.service";
import { TransactionsService } from "../services/transaction.service";


export class ReceivePaymentHandler extends FunctionHandler<any, any>
{
  private tools: HandlerTools;
  private _paymentService: PaymentCoreService;
  private _subscriptionService: SubscriptionService;
  private mollieCustomerService: MollieCustomerService;
  private _trnService: TransactionsService;
  private iTalUser: iTalUser;


  public async execute(data: {id: string}, context: FunctionContext, tools: HandlerTools): Promise<any> {

    tools.Logger.log(()=> `[ReceivePaymentHandler].execute - Payload :: ${JSON.stringify(data)}`);

    this._paymentService =  new PaymentCoreService(process.env.MOLLIE_API_KEY, tools);
    this._subscriptionService = new SubscriptionService(tools);
    this._trnService  = new TransactionsService(tools);

    /**
     * The webhook that is sent to mollie so as to update on payment status.
     */
    try {
      const paymentDetails = await this._paymentService.getPaymentDetails(data.id);

      tools.Logger.log(()=> `[ReceivePaymentHandler].execute - Payment status :: ${paymentDetails}`);

      const mollieCustomerId = paymentDetails.customerId;

      const user = await this.getUserByMollieId(mollieCustomerId, tools);

      // Get transaction details:
      const trnDetails  = await this._trnService.getTransaction(data.id, user.id);

      if (trnDetails) {
        return this.handlePaymentStatus(paymentDetails, user, trnDetails);
      } else  {
        tools.Logger.error(() => `missing transaction error `)
      }
    } catch (e) {
      tools.Logger.log(() => `${e.message}`);
    }
  }
/**
 * 
 * @param payment payment object returned by mollie api 
 * @param user a clm user registered on mollie
 * @param trn A transaction
 * @returns updates transaction doc with received status
 */
  
  async handlePaymentStatus(payment: any, user: iTalUser, trn: Transaction){
    switch (payment.status) {
      case 'paid':
        trn.status = TransactionStatus.success;

        if(payment.sequenceType == 'first') {
          await this._trnService.updateTransaction(trn, user.id);
          return this._paymentService.onFirstPayment(payment, user);
        } else if (payment.sequenceType == 'recurring') {
          const subTrn = await this._trnService.getTransaction(trn.id, user.id);
          if(subTrn != null){
          subTrn.status = TransactionStatus.success;

          await this._trnService.updateTransaction(subTrn, user.id);
          return this._subscriptionService.renewSubscription(trn, payment); }
        }
        break;
      case 'failed':
        trn.status = TransactionStatus.fail;
        return this._trnService.updateTransaction(trn, user.id);
      default:
        return;
    }
  }

  async getUserByMollieId(mollieId: string, tools: HandlerTools) {
    const userRepo$ = tools.getRepository<iTalUser>('users');

    const user = (await userRepo$.getDocuments(new Query().where('mollieCustomerId', '==', mollieId)))[0]

    // TODO: Handle null user or multiple users
    return user;
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