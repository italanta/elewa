import axios from "axios";

import { createMollieClient } from '@mollie/api-client';

import { HandlerTools } from '@iote/cqrs';

import { iTalUser } from '@app/model/user';

import { Customer } from '../models/customer'

export class MollieCustomerService {
  private mollieClient;
  private _apiKey: string;

  constructor(
    private tools: HandlerTools
  ) {
    this._apiKey = process.env.MOLLIE_API_KEY as string;
    this.mollieClient = createMollieClient({ apiKey: this._apiKey });
    this.tools = tools;
  }
/**
  * Create a Mollie customer using user information.
*/
  async createMollieCustomer(user: iTalUser) {
    this.tools.Logger.log(() => `CustomerService: createMollieCustomer`);
    
    const mollieCustomer: Customer = {
      name: user.displayName || user.id as string,
      email: user.email,
    };

    this.tools.Logger.log(
      () => `execute: Mollie Customer Obj => ${JSON.stringify(mollieCustomer)}`
    );

    const customerObject = await this.mollieClient.customers.create(
      mollieCustomer
    );

    // Log customerObject
    this.tools.Logger.log(
      () => `execute: Customer Object => ${JSON.stringify(customerObject)}`
    );

    user.mollieCustomerId = customerObject.id;

    await this.updateUser(user);

    return user.mollieCustomerId;
  }
/**Get mandates for a Mollie customer
 * @returns Valid mandate ID or null
 */
  async getMandates(user: iTalUser) {
    const URL = `https://api.mollie.com/v2/customers/${user.mollieCustomerId}/mandates`;
    const resp = await axios.get(URL, {
      headers: {
        'Authorization': `Bearer ${this._apiKey}`
      }
    })

    return resp.data._embedded.mandates;
  }

  async _getValidMandate(user: iTalUser) {
    const mandatesData = await this.getMandates(user)
    for (const mandate of mandatesData) {
      if (mandate.status === 'valid' || mandate.status === 'pending') {
        return mandate.id;
      }
    }

    return null;
  }

  getUser(userId: string) {
    const userRepo = this.tools.getRepository<iTalUser>('users');

    return userRepo.getDocumentById(userId);
  }

  updateUser(user: iTalUser) {
    const userRepo = this.tools.getRepository<iTalUser>('users');

    return userRepo.update(user);
  }
}
