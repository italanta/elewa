import { CloudFunction } from 'firebase-functions/v2';
import { DocumentOptions, onDocumentDeletedWithAuthContext } from 'firebase-functions/v2/firestore';

import { FirestoreRegistrar } from './firestore.registrar';
import { FIREBASE_REGIONS } from '../regions.type';

/**
 * Firestore registrar.
 */
export class FirestoreDeleteRegistrar<T, R> extends FirestoreRegistrar<T, R>
{
  /**
   *  Firestore registration. For registering a function that listens to an on-create firestore event.
   *
   * @param documentPath - Path to document e.g. 'prospects/{prospectId}'.
   *                       Can be more extensive path e.g. repository of subcollections.
   */
  constructor(documentPath: string, 
              private _region: FIREBASE_REGIONS = 'europe-west1',
              private _options?: DocumentOptions) 
  { 
    super(documentPath); 
  }

  register(func: (dataSnap: any, context: any) => Promise<R>)
  {
    const opts = { 
      document: this._documentPath, 
      region: this._region,
      ... this._options ?? {}
    } as DocumentOptions;

    return onDocumentDeletedWithAuthContext
    ( 
      opts, 
      (event) => func(event.data.data() as T, event)
   
    ) as CloudFunction<any>;
  }

}
