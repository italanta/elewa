import { FirestoreEvent, FirestoreAuthEvent } from 'firebase-functions/v2/firestore';

import { FunctionRegistrar } from "../function-registrar.interface";
import { FirestoreContext } from './context/firestore.context';
import { FunctionContext } from "../../context/context.interface";

/**
 * Firestore registrar.
 */
export abstract class FirestoreRegistrar<T, R> extends FunctionRegistrar<T, R>
{
  /**
   *  Firestore registration. For registering a function that listens to a firestore event.
   *
   * @param documentPath - Path to document e.g. 'prospects/{prospectId}'.
   *                       Can be more extensive path e.g. repository of subcollections.
   */
  constructor(protected _documentPath: string) { super(); }

  /**
   * Convert params of onCreate to input for CloudHandler
   *
   * @param data Snapshot of data to create.
   * @param context
   */
  before(dataSnap: any, context: any): Promise<{ data: T; context: FirestoreContext; }> 
  {
    const eventAuth = context as FirestoreAuthEvent<T>;
    
    // @See https://firebase.google.com/docs/functions/firestore-events?gen=2nd#auth-context
    const userId = eventAuth.authId ? eventAuth.authId: null;
    // TODO: Sync with parent FirestoreUpdateRegistrar. Build smarter super calls.
    
    return new Promise(resolve => resolve({
      data: dataSnap,
      context: { eventContext: eventAuth, userId, isAuthenticated: userId != null }
    }));
  }

  onError(e: Error)
  {
    // Bugfix - This context gets lost on async errors.
    console.error(`Error occured during execution.\nMsg:${e.message}`);
    console.error(`Printing Stack Trace`);
    console.error(e.stack);

    return new Promise((_) => 'Error during execution. Fail gracefully.');
  }

  after(result: R, context: FunctionContext): any {
    return result;
  }

}
