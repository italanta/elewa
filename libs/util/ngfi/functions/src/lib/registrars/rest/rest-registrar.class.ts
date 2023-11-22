import { onCall } from "firebase-functions/v2/https";

import { FunctionRegistrar } from "../function-registrar.interface";

import { FunctionContext } from "../../context/context.interface";
import { FIREBASE_REGIONS } from '../regions.type';

/**
 * Firestore registrar.
 *
 * REST Service Registration
 */
export class RestRegistrar<T, R> extends FunctionRegistrar<T, R>
{
  constructor(private _region: FIREBASE_REGIONS = 'europe-west1') { super(); }

  register(func: (dataSnap: any, context: any) => Promise<R>)
  {
    return onCall<T, Promise<R>>({ region: this._region }, (req) => func(req.data, req));
  }

  before(dataSnap: any, context: any): { data: T; context: FunctionContext; } {
    return { data: dataSnap, context };
  }

  after(result: R, _: any): any {
    return result;
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(e.stack); throw e; });
  }

}
