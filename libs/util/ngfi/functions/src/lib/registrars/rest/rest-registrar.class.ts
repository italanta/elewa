import * as functions from 'firebase-functions';

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

  register(func: (dataSnap: any, context: any) => Promise<R>): functions.CloudFunction<any>
  {
    return functions.region(this._region).https.onCall(func);
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
