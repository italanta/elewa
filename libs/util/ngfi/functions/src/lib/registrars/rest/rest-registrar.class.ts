import { CloudEvent, CloudFunction } from 'firebase-functions/v2';
import { HttpsFunction, onCall, CallableOptions, CallableRequest } from 'firebase-functions/v2/https';

import { FunctionRegistrar } from "../function-registrar.interface";
import { FunctionContext } from "../../context/context.interface";

/**
 * Firestore registrar.
 *
 * REST Service Registration
 */
export class RestRegistrar<T, R> extends FunctionRegistrar<T, R>
{
  constructor(private _options: CallableOptions = { region: 'europe-west1', cors: true, }) 
  { super(); }

  register(func: (dataSnap: any, context: any) => Promise<R>): CloudFunction<CloudEvent<any>> | HttpsFunction
  {
    return onCall(this._options, (req: CallableRequest<T>) => func(req.data, req));
  }

  before(dataSnap: any, context: any): Promise<{ data: T; context: FunctionContext; }>
  {
    const data = dataSnap as T;
    const fnCtx  = context as CallableRequest<T>;

    const isAuth = !!fnCtx.auth && fnCtx.auth.uid != null;

    const ctx: FunctionContext = {
      eventContext: fnCtx,
      isAuthenticated: isAuth, userId: isAuth ? fnCtx.auth.uid : 'noop',
      userToken: isAuth ? fnCtx.auth.token : null
    }

    return new Promise(resolve => resolve({ data, context: ctx }));
  }

  after(result: R, _: any): any {
    return result;
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(e.stack); throw e; });
  }

}
