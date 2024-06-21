import { FirestoreAuthEvent } from 'firebase-functions/v2/firestore';

import { FunctionContext } from '../../../context/context.interface';


export interface FirestoreContext extends FunctionContext
{
  eventContext: FirestoreAuthEvent<any>;
}
