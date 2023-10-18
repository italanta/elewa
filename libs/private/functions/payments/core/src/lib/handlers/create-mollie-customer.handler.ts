import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { MollieCustomerService } from "../services/customer-core-service";
import { Customer } from "../models/customer";
import { iTalUser } from "@app/model/user";

export class CreateMollieCustomerHandler extends FunctionHandler<any, Promise<void>> {
  private mollieCustomerService: MollieCustomerService
  private customer: Customer
  private iTalUser: iTalUser;

  public async execute(data: any, context: FunctionContext, tools: HandlerTools): Promise<any> {
    /**nitialize the MollieCustomerService with the customer and API key */
    this.mollieCustomerService = new MollieCustomerService(tools);

    /**
    * t the iTalUser associated with the provided user ID
    * Create a Mollie customer using the iTalUser data
    */
    try {
        this.iTalUser = await this.mollieCustomerService.getUser(data.userId)
        const mollieCustomer = await this.mollieCustomerService.createMollieCustomer(this.iTalUser)
      
        tools.Logger.log(() => `execute: Creating a customer to the mollie api`);
        return mollieCustomer
    } catch (e) {
        tools.Logger.log(() => e);
        throw e;
    }
}


}
