import { Response } from 'express';
import { CloudEvent, CloudFunction,  } from 'firebase-functions/v2';
import { HttpsFunction, HttpsOptions, onRequest } from 'firebase-functions/v2/https';

import { FunctionRegistrar } from "../function-registrar.interface";

import { HttpsContext } from '../../context/https-context.interface';

/** 
 * HTTPS Endpoint Registrar.
 * 
 * @see 
 */
export class EndpointRegistrar<T, R> extends FunctionRegistrar<T, any>
{
  // private _ctx: HttpsContext;

  constructor(private _options: HttpsOptions = { region: 'europe-west1', cors: true }) 
  { super(); }

  register(func: (req: any, resp: any) => Promise<void>): CloudFunction<CloudEvent<any>> | HttpsFunction
  {
    return onRequest(this._options, func);
  }

  before(req: any, resp: any): { data: T; context: HttpsContext; }
  {
    const context = 
    { 
      request: req, 
      response: resp as Response, 

    // Unsafe!!! TODO: Integrate auth security
      eventContext: { response: resp }, 
      isAuthenticated: false, userId: 'external', 
      environment: process.env as any 
    };
    // this._ctx = context;
    
    return { data: req.body as any as T, context};
  }

  /** Send back result to the server */
  after(result: R, context: HttpsContext): any 
  {
    return context.response.send(result);
  }

  onError(e: Error) {
    console.error(e.message);
    console.error(e.stack);

    throw e;
    return new Promise((err) => 'unreachable');
  }

}
