import * as functions from 'firebase-functions';
import { FunctionRegistrar } from "../function-registrar.interface";

import { FIREBASE_REGIONS } from '../regions.type';
import { HttpsContext } from '../../context/https-context.interface';


/**
 * Firestore registrar.
 *
 * REST Service Registration
 */
export class EndpointRegistrar<T, R> extends FunctionRegistrar<T, any>
{
  constructor(private _region: FIREBASE_REGIONS = 'europe-west1') { super(); }

  register(func: (req: any, resp: any) => Promise<void>): functions.HttpsFunction
  {
    return functions.region(this._region).https.onRequest(func);
  }

  before(req: functions.Request, context: any): { data: T; context: HttpsContext; }
  {
    context = context as functions.Response<R>;
                                                        // Unsafe!!! TODO: Integrate auth security
    return { data: req.body as any as T, context: { request: req, response: context, eventContext: context, isAuthenticated: false, userId: 'external', environment: process.env as any }};
  }

  after(result: R, context: HttpsContext): any {
    return context.response.send(result);
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(e.stack); throw e; });
  }

}
