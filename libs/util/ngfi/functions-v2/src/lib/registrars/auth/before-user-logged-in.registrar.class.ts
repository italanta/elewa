import { AuthBlockingEvent, AuthUserRecord, beforeUserSignedIn, BlockingOptions,  } from "firebase-functions/v2/identity";

import { FunctionRegistrar } from "../function-registrar.interface";

import { FunctionContext } from "../../context/context.interface";
import { FIREBASE_REGIONS } from '../regions.type';


/**
 * PubSub registrar.
 */
export class BeforeUserLoggedInRegistrar extends FunctionRegistrar<AuthUserRecord, void>
{
  constructor(private _topic: string,
              private _region: FIREBASE_REGIONS = 'europe-west1',
              private _opts?: BlockingOptions)
  { super(); }

  register(func: (dataSnap: any, context: any) => Promise<void>)
  {
    const opts: BlockingOptions = {
      region: this._region,
      ... this._opts ?? {}
    };
    
    return beforeUserSignedIn
    (
      opts, 
      (event) => func(event.data, event)
    );
  }

  before(dt: any, context: any): Promise<{ data: AuthUserRecord, context: FunctionContext; }>
  {
    const event = context as AuthBlockingEvent;
    const data = event.data;

    return new Promise(resolve => resolve({ 
      data, context: { eventContext: context, isAuthenticated: true, userId: data.uid } }));
  }

  after(result: void, _: any): any {
    return;
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(JSON.stringify(e.stack)); throw e; });
  }

}
