import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";

export class CreateMollieCustomerHandler extends FunctionHandler<any, Promise<void>> {
  private tools: HandlerTools

  public async execute(data: {userId: string}, context: FunctionContext, tools: HandlerTools): Promise<any> {
    try {
      console.log("test")
      this.tools.Logger.log(() => `execute: Creating a customer to the mollie api`);
    } catch (e) {
      tools.Logger.log(() => e);
      throw e;
    }
  }

}
