import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { iTalUser } from "@app/model/user";
import { Transaction, TransactionStatus } from "../models/transaction";

import { PaymentCoreService } from "../services/payment-core.service";
import { SubscriptionService } from "../services/subscription-core.service";
import { TransactionsService } from "../services/transaction.service";


export class ReceivePaymentHandler extends FunctionHandler<any, any>
{
  private tools: HandlerTools;
  private _paymentService: PaymentCoreService;
  private _subscriptionService: SubscriptionService;
  private _trnService: TransactionsService;
  private iTalUser: iTalUser;


  public async execute(data: {id: string}, context: FunctionContext, tools: HandlerTools): Promise<any> {
    /** Log the incoming payload for reference */
    tools.Logger.log(()=> `[ReceivePaymentHandler].execute - Payload :: ${JSON.stringify(data)}`);
    /**Initialize necessary services */
    this._paymentService =  new PaymentCoreService(process.env.MOLLIE_API_KEY as string, tools);
    this._subscriptionService = new SubscriptionService(tools);
    this._trnService  = new TransactionsService(tools);

    /**
     * The webhook that is sent to mollie so as to update on payment status.
     */
    try {
      /**Retrieve payment details from Mollie */
      const paymentDetails = await this._paymentService.getPaymentDetails(data.id);

      tools.Logger.log(()=> `[ReceivePaymentHandler].execute - Payment status :: ${paymentDetails}`);

      const mollieCustomerId = paymentDetails?.customerId as string;

      const user = await this.getUserByMollieId(mollieCustomerId, tools);

      /* Get transaction details: */
      const trnDetails  = await this._trnService.getTransaction(data.id, user?.id as string);

      if (trnDetails) {
        return this.handlePaymentStatus(paymentDetails, user, trnDetails);
      } else  {
        tools.Logger.error(() => `missing transaction error `)
      }
    } catch (e) {
      tools.Logger.log(() => `${JSON.stringify(e)}`);
    }
  }
/**
 * Handle payment status based on Mollie payment object.
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
          await this._trnService.updateTransaction(trn, user?.id as string);
          return this._paymentService.onFirstPayment(payment, user);
        } else if (payment.sequenceType == 'recurring') {
          const subTrn = await this._trnService.getTransaction(trn.id, user?.id as string);
          if(subTrn != null){
          subTrn.status = TransactionStatus.success;

          await this._trnService.updateTransaction(subTrn, user?.id as string);
          return this._subscriptionService.renewSubscription(trn, payment); }
        }
        break;
      case 'failed':
        trn.status = TransactionStatus.fail; 
        return this._trnService.updateTransaction(trn, user?.id as string);
      default:
        return null;
    }
  }
  /**
   * Retrieve a user by their Mollie customer ID.
   * @param mollieId - Mollie customer ID.
   * @param tools - HandlerTools instance.
   * @returns User associated with the provided Mollie customer ID.
   */
  async getUserByMollieId(mollieId: string, tools: HandlerTools) {
    const userRepo$ = tools.getRepository<iTalUser>('users');

    const user = (await userRepo$.getDocuments(new Query().where('mollieCustomerId', '==', mollieId)))[0]

    // TODO: Handle null user or multiple users
    return user;
  }
  
 }
