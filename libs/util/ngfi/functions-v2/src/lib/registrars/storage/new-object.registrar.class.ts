
import { CloudEvent, CloudFunction } from 'firebase-functions/v2';
import { onObjectFinalized, StorageOptions, StorageObjectData } from 'firebase-functions/v2/storage';

import { FunctionRegistrar } from "../function-registrar.interface";

import { FunctionContext } from "../../context/context.interface";
import { FIREBASE_REGIONS } from '../regions.type';

/**
 * Object created registrar.
 */
export class CloudStorageObjectCreatedRegistrar extends FunctionRegistrar<StorageObjectData, void>
{
  constructor(private _bucket: string,
              private _region: FIREBASE_REGIONS = 'europe-west1',
              private _opts?: StorageOptions)
  { super(); }

  register(func: (dataSnap: any, context: any) => Promise<void>) : CloudFunction<CloudEvent<StorageObjectData>> 
  {
    const opts: StorageOptions = {
      bucket: this._bucket,
      region: this._region,
      ... this._opts ?? {}
    };
    
    return onObjectFinalized
    (
      opts, 
      (event) => func(event.data, event)
    );
  }

  before(message: any, context: any): Promise<{ data: StorageObjectData, context: FunctionContext; }>
  {
    const data  = message as StorageObjectData;

    return new Promise(resolve => resolve({ data, context: { eventContext: context, isAuthenticated: true, userId: 'root' } }));
  }

  after(result: void, _: any): any {
    return;
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(JSON.stringify(e.stack)); throw e; });
  }

}
