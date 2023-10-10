import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { Query } from "@ngfi/firestore-qbuilder";
import createMollieClient from "@mollie/api-client";

import { Customer } from '../models/customer';

export class CreateMollieCustomerHandler extends FunctionHandler<any, Promise<void>> {
  // Declare mollieClient as a class property
  private mollieClient = createMollieClient({ apiKey: 'test_RTxqmDAhRdfWncsEuHRW6pgbAW6yNs' });

  public async execute(data: Customer, context: FunctionContext, tools: HandlerTools): Promise<any> {
    try {
      const mollieCustomer: Customer = {
        name: data.name,
        email: data.email
      };

      tools.Logger.log(() => `execute: Mollie Customer Obj => ${JSON.stringify(mollieCustomer)}`);

      const customerObject = await createMollieCustomer(this.mollieClient, mollieCustomer, tools);

      // Log customerObject
      tools.Logger.log(() => `execute: Customer Object => ${JSON.stringify(customerObject)}`);

      // Access the customer ID from the customerObject
      const customerID = customerObject.id;

      // Log customer ID
      tools.Logger.log(() => `execute: Customer ID => ${customerID}`);

      const customerRepo = tools.getRepository<Customer>('mollie-customers');

      await customerRepo.write(customerObject as unknown as Customer, customerID);
    } catch (e) {
      tools.Logger.log(() => e);
    }
  }
}

// Modify createMollieCustomer to accept mollieClient and mollieCustomer as arguments
async function createMollieCustomer(mollieClient, mollieCustomer, tools: HandlerTools) {
  try {
    tools.Logger.log(() => `execute: Created a customer to the mollie api`);
    const customer = await mollieClient.customers.create(mollieCustomer);
    return customer;
  } catch (e) {
    tools.Logger.log(() => e);
    throw e;
  }
}
