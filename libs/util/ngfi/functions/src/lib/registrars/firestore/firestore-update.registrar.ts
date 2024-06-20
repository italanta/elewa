import * as functions from 'firebase-functions';

import { FirestoreRegistrar } from './firestore.registrar';

import { FirestoreUpdateContext } from './context/firestore-update.context';
import { FIREBASE_REGIONS } from '../regions.type';


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
   */
  constructor(documentPath: string,
              protected _withMerge: boolean = false,
              protected _mergeName: string  = '',
              private _region: FIREBASE_REGIONS = 'europe-west1')
  {
    super(documentPath);

    // Avoid errors before deploying.
    if (_withMerge && !_mergeName)
      throw new Error(`Firestore Update Registrar compile error for documentPath ${documentPath}. Passed _withMerge as true but no _mergeName.`);
  }

  register(func: (dataSnap: any, context: any) => Promise<R>): functions.CloudFunction<any>
  {
    return functions.region(this._region)
                    .firestore.document(this._documentPath)
                    .onUpdate(func);
  }

  /**
   * Convert params of onCreate to input for CloudHandler
   *
   * @param data Snapshot of data to create.
   * @param context
   */
  before(dataSnap: any, context: any): { data: T; context: FirestoreUpdateContext; }
  {
    const userId = context.auth ? context.auth.uid: null;

    const before = dataSnap.before.data();
    if (before) { context.before = before; }

    return {
      data: dataSnap.after.data(),
      context: { change: dataSnap, eventContext: context, userId, isAuthenticated: userId != null, environment: process.env as any }
    };
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
