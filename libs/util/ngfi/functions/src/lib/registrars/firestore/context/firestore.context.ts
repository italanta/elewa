import { EventContext } from 'firebase-functions';

import { FunctionContext } from '../../../context/context.interface';


export interface FirestoreContext extends FunctionContext
{
  eventContext: EventContext;
}
