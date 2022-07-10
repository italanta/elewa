import { FirebaseFirestore, Transaction } from '@firebase/firestore-types'

import { IObject } from '@iote/bricks';
import { Repository } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';

/**
 * Repository to be used inside of Firebase Functions.
 *
 * Admin powered.
 */
export class AdminRepository<T extends IObject> implements Repository<T>
{
  constructor(private _collectionName: string,
              private _db: FirebaseFirestore)
  { }

  public performTransaction(trFn: (tr: Transaction, _db: FirebaseFirestore) => Promise<any>)
  {
    return this._db.runTransaction((tr: Transaction) => trFn(tr, this._db));
  }

  public getDocumentById(id: string): Promise<T>
  {
    return this._db.collection(this._collectionName)
                   .doc(id).get()
                   .then(d => {
                     if(d && d.data()) {
                      const obj = <T> d.data();
                      obj.id = id;
                      return obj;
                     }
                     else return null;
                    });
  }



  public getDocuments(query: Query): Promise<T[]>
  {
    return <Promise<T[]>>
      query.__buildForFireStore(this._db.collection(this._collectionName))
           .get()
           .then(this._mergeWithDocId);
  }

  public create(data: T, id?: string, extendId = false): Promise<T>
  {
    data.createdOn = new Date();

    if(!data.createdBy)
      // Watch out for race conditions. Not single threaded, should find safer RNG
      data.createdBy = 'admin-' + data.createdOn.getTime();

    return (id ? this._createWithId(data, id, extendId)

               : this._db.collection(this._collectionName)
                         .add(data).then(v => { data.id = v.id;  return data; }));
  }

  /** @param allowExtend: if true, will not throw error when id already exists */
  private _createWithId(data: T, id: string, allowExtend: boolean)
  {
    const doc = this._db.collection(this._collectionName)
                         .doc(id);
    return doc.get()
              .then(d => {
                if(d && d.data())
                {
                  if(allowExtend) {
                    data.id = `${data.id}_${this._generateGuid()}`;
                    return this._db.collection(this._collectionName).doc(data.id).set(data).then(() => data);
                  }
                  else throw new Error('cant_create_existing');
                }
                else return doc.set(data).then(() => data) });
  }

  public update(t: T): Promise<T>
  {
    if (!t.id)
      throw new Error("Trying to update POJO-object. Need active document with database id.");

    t.updatedOn = new Date();

    return this._db.collection(this._collectionName)
                        .doc(t.id)
                        .update(t)
                        .then(wr => t);
  }

  public write(t: T, id: string): Promise<T>
  {
    t.id = id;
    if(! t.createdOn) {
      t.createdOn = new Date();
      t.createdBy = 'admin';
    }
    else
      t.updatedOn = new Date();

    return this._db.collection(this._collectionName)
                        .doc(t.id)
                        .set(t)
                        .then(wr => t);
  }

  delete(id: string): Promise<boolean>
  {
    return this._db.collection(this._collectionName)
                   .doc(id)
                   .delete()
                   .then(() => true)
                   .catch(() => false);
  }

  /**
   * Gets documents owned by user (user_id field == uid).
   */
  public getUserDocuments(query = new Query(), uid: string): Promise<T[]>
  {
    query.where('createdBy', '==', uid);

    return this.getDocuments(query);
  }

  /** By default, Firebase does not store document id. We therefore merge documents with their id. */
  private _mergeWithDocId(actions: any) : T[]
  {
    return actions.docs.map((a: any) => {
      const data = <T> a.data();
            data.id = a.id;

      return data;
    });
  }

  private _generateGuid = () => 'xxxxxxxxx'
                                    .replace(/[xy]/g, function(c) { const r = Math.random() * 10 | 0,
                                                                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                                                                    return v.toString(10); });
}