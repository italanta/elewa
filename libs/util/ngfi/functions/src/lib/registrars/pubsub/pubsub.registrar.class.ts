
import { CloudEvent, CloudFunction } from 'firebase-functions/v2';
import { onMessagePublished, PubSubOptions, Message } from 'firebase-functions/v2/pubsub';

import { FunctionRegistrar } from "../function-registrar.interface";

import { FunctionContext } from "../../context/context.interface";
import { FIREBASE_REGIONS } from '../regions.type';

/**
 * PubSub registrar.
 */
export class PubSubRegistrar<T> extends FunctionRegistrar<T, void>
{
  constructor(private _topic: string,
              private _region: FIREBASE_REGIONS = 'europe-west1',
              private _opts?: PubSubOptions)
  { super(); }

  register(func: (dataSnap: any, context: any) => Promise<void>) : CloudFunction<CloudEvent<any>> 
  {
    const opts: PubSubOptions = {
      topic: this._topic,
      region: this._region,
      ... this._opts ?? {}
    };
    
    return onMessagePublished
    (
      opts, 
      (event) => func(event.data.message, event)
    );
  }

  before(message: any, context: any): Promise<{ data: T, context: FunctionContext; }>
  {
    const msg  = message as Message<T>;
    const data = msg.json as T;

    return new Promise(resolve => resolve({ data, context: { eventContext: context, isAuthenticated: true, userId: 'root' } }));
  }

  after(result: void, _: any): any {
    return;
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(JSON.stringify(e.stack)); throw e; });
  }

}
