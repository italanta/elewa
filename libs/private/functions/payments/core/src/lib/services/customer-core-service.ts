import axios from "axios";

import { createMollieClient } from '@mollie/api-client';

import { HandlerTools } from '@iote/cqrs';

import { iTalUser } from '@app/model/user';

import { Customer } from '../models/customer'

import { environment } from '../../environments/environment';

export class MollieCustomerService {
  private mollieClient;
  private tools: HandlerTools
  
  public updateUser(user: iTalUser) {
    return this._updateUser(user);
  }
  public getUser(user: iTalUser) {
    return this._getUser(user.id)
  }

  constructor(
    public customer: Customer,
    private _apiKey: string,
  ) {
    this._apiKey = environment.mollieApiKey;
    this.mollieClient = createMollieClient({ apiKey: this._apiKey });
  }

  async createMollieCustomer(userId: string) {
    this.tools.Logger.log(() => `CustomerService: createMollieCustomer`);

    const user = await this._getUser(userId);

    const mollieCustomer: Customer = {
      name: user.displayName || user.id,
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

    await this._updateUser(user);

    return user.mollieCustomerId;
  }

  async getMandates(userId: string) {
    const user = await this._getUser(userId);
    const URL = `https://api.mollie.com/v2/customers/${user.mollieCustomerId}/mandates`;
    const resp = await axios.get(URL, {
      headers: {
        'Authorization': `Bearer ${this._apiKey}`
      }
    })

    return resp.data._embedded.mandates;
  }

  async checkIfMollieCustomer(userId: string) {
    const user = await this._getUser(userId);
    if (user.mollieCustomerId) {
      return user.mollieCustomerId;
    } else {
      return false;
    }
  }

  async _getValidMandate(userId: string) {
    const mandatesData = await this.getMandates(userId)
    for (const mandate of mandatesData) {
      if (mandate.status === 'valid') {
        return mandate.id;
      }
    }

    return null;
  }

  private _getUser(userId: string) {
    const userRepo = this.tools.getRepository<iTalUser>('users');

    return userRepo.getDocumentById(userId);
  }

  private _updateUser(user: iTalUser) {
    const userRepo = this.tools.getRepository<iTalUser>('users');

    return userRepo.update(user);
  }
}
