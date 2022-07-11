import * as functions from 'firebase-functions';

import { FIREBASE_REGIONS } from '../regions.type';
import { FunctionRegistrar } from '../function-registrar.interface';
import { FunctionContext } from '../../context/context.interface';


/**
 * Realtime DB Create registrar.
 */
export class RealtimeDbCreateRegistrar<T, R> extends FunctionRegistrar<T, R>
{
  /**
   *  Firestore registration. For registering a function that listens to an on-create firestore event.
   *
   * @param documentPath - Path to document e.g. 'prospects/{prospectId}'.
   *                       Can be more extensive path e.g. repository of subcollections.
   */
  constructor(protected _documentPath: string,
              private   _region: FIREBASE_REGIONS = 'europe-west1')
  {
    super();

  }

  register(func: (dataSnap: any, context: any) => Promise<R>): functions.CloudFunction<any>
  {
    const base = functions.region(this._region)

    // RealtimeDB and Firestore use same middleware, so we can support both with one registrar.
    return base.database.ref(this._documentPath).onCreate(func);
  }

  /**
   * Convert params of onCreate to input for CloudHandler
   *
   * @param data Snapshot of data to create.
   * @param context
   */
  before(dataSnap: any, context: any): { data: T; context: FunctionContext; }
  {
    const userId = context.auth ? context.auth.uid: null;

    return {
      data: dataSnap.val(),
      context: { eventContext: context, params: context.params, userId, isAuthenticated: userId != null, environment: process.env as any }
    };
  }

  after(result: R, context: FunctionContext): any
  {
    return result;
  }

  onError(e: Error)
  {
    // Bugfix - This context gets lost on async errors.
    console.error(`Error occured during execution.\nMsg:${e.message}`);
    console.error(`Printing Stack Trace`);
    console.error(e.stack);

    return new Promise((_) => 'Error during execution. Fail gracefully.');
  }
}
