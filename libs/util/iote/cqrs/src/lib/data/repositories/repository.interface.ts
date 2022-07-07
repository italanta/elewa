import { Transaction, FirebaseFirestore } from '@firebase/firestore-types';

import { IObject } from '@iote/bricks';
import { Query } from '@ngfi/firestore-qbuilder';

/**
 * Repository to be used inside of Handlers.
 */
export interface Repository<T extends IObject>
{
  getDocumentById(id: string): Promise<T>;
  getDocuments(query: Query): Promise<T[]>;

  create(data: T, id?: string, extendId?: boolean): Promise<T>;
  update(t: T): Promise<T>;
  write(t: T, id: string): Promise<T>;
  delete(id: string): Promise<boolean>;

  /** Gets documents owned by user (user_id field == uid). */
  getUserDocuments(query: Query, uid: string): Promise<T[]>;

  performTransaction(trFn: (tr: Transaction, _db: FirebaseFirestore) => Promise<any>): Promise<any>;
}
