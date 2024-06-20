import { DatabaseEvent, DataSnapshot, onValueCreated, ReferenceOptions } from 'firebase-functions/v2/database';

import { FIREBASE_REGIONS } from '../regions.type';
import { FunctionRegistrar } from '../function-registrar.interface';
import { FunctionContext } from '../../context/context.interface';
import { CloudFunction } from 'firebase-functions/v2';


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
              private   _region: FIREBASE_REGIONS = 'europe-west1',
              private _opts?: ReferenceOptions)
  {
    super();

  }

  register(func: (dataSnap: any, context: any) => Promise<R>) : CloudFunction<any>
  {
    const opts= {
      ref: this._documentPath,
      region: this._region,

      ... this._opts ?? {}
    } as ReferenceOptions;

    return onValueCreated(opts, (event => func(event.data, event)));
  }

  /**
   * Convert params of onCreate to input for CloudHandler
   *
   * @param data Snapshot of data to create.
   * @param context
   */
  before(dataSnap: any, context: any): Promise<{ data: T; context: FunctionContext; }>
  {
    const event = context as DatabaseEvent<DataSnapshot, Record<string, string>>;

    return new Promise(resolve => resolve({
      data: event.data.val() as T,
      context: { 
        eventContext: event, 
        params: event.params,

        isAuthenticated: true,
        userId: 'root'
      }
    }));
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
