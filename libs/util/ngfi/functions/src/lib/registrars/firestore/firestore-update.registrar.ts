import { CloudFunction } from 'firebase-functions/v2';
import { DocumentOptions, FirestoreAuthEvent, onDocumentUpdatedWithAuthContext } from 'firebase-functions/v2/firestore';

import { FIREBASE_REGIONS } from '../regions.type';
import { FirestoreRegistrar } from './firestore.registrar';
import { FirestoreUpdateContext } from './context/firestore-update.context';


/**
 * Firestore registrar.
 */
export class FirestoreUpdateRegistrar<T, R> extends FirestoreRegistrar<T, R>
{
  /**
   *  Firestore registration. For registering a function that listens to an on-create firestore event.
   *
   * @param documentPath - Path to document e.g. 'prospects/{prospectId}'.
   *                       Can be more extensive path e.g. repository of subcollections.
   * 
   * @param _withMerge - If true, the result of the function will be stored on the object
   * @param _mergeName - Required to be filled and non-empty when _withMerge is set.
   *                     Name of the attribute to update with function result when function completes.
   */
  constructor(documentPath: string,
              protected _withMerge = false,
              protected _mergeName = '',
              private _region: FIREBASE_REGIONS = 'europe-west1',
              private _options?: DocumentOptions)
  {
    super(documentPath);

    // Avoid errors before deploying.
    if (_withMerge && !_mergeName)
      throw new Error(`Firestore Update Registrar compile error for documentPath ${documentPath}. Passed _withMerge as true but no _mergeName.`);
  }

  register(func: (dataSnap: any, context: any) => Promise<R>): CloudFunction<any>
  {
    const opts = { 
      document: this._documentPath, 
      region: this._region,
      ... this._options ?? {}
    } as DocumentOptions;

    return onDocumentUpdatedWithAuthContext
    ( 
      opts, 
      (event) => func(event.data.after.data() as T, event)
   
    ) as CloudFunction<any>;
  }

  /**
   * Convert params of onCreate to input for CloudHandler
   *
   * @param data Snapshot of data to create.
   * @param context
   */
  before(dataSnap: any, context: any): Promise<{ data: T; context: FirestoreUpdateContext; }>
  {
    const eventAuth = context as FirestoreAuthEvent<T>;
    
    // @See https://firebase.google.com/docs/functions/firestore-events?gen=2nd#auth-context
    const userId = eventAuth.authId ? eventAuth.authId: null;
    // TODO: Sync with parent FirestoreUpdateRegistrar. Build smarter super calls.
    
    const ctx = { change: dataSnap, eventContext: eventAuth, userId, isAuthenticated: userId != null } as FirestoreUpdateContext;

    const before = dataSnap.before.data();
    if (before) { ctx.before = before; }

    return new Promise(resolve => resolve({
      data: dataSnap.after.data(),
      context: ctx
    }));
  }

  after(result: R, context: FirestoreUpdateContext): any
  {
    if (this._withMerge)
      return context.change.after
                    .ref.set(this._prepareMerge(result), { merge: true});

    return result;
  }

  /** Prepares data to be merged with existing doc.s */
  _prepareMerge(data: R) {
    const toMerge : any = {};
    toMerge[this._mergeName] = data;
    return toMerge;
  }
}
