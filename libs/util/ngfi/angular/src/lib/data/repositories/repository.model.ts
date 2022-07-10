import { Observable, from } from 'rxjs';
import { map, catchError, take, mergeMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, QueryFn } from '@angular/fire/compat/firestore';

import { Query } from '@ngfi/firestore-qbuilder';
import { IObject, User } from '@iote/bricks';

import { UserService } from '../../auth/services/user.service';


export class Repository<T extends IObject> {

  constructor(protected _collectionName: string,
              protected _db: AngularFirestore,
              protected _userService: UserService<User>)
  { }

  /**
   * Gets documents owned by user (user_id field == uid).
   */
  public getUserDocuments(query = new Query()): Observable<T[]>
  {
    return this._userService.getUserId()
                            .pipe(
                              take(1),
                              mergeMap(uid => {
                                query.where('createdBy', '==', uid);

                                return this.getDocuments(query);
                              }));

  }

  public getDocumentById(id: string): Observable<T> {
    return this._db.collection(this._collectionName)
                   .doc(id).snapshotChanges()
                   .pipe(map(d => {
                      const obj = <T> d.payload.data();
                      if(obj) {
                        obj.id = id;
                        return obj;
                      }
                      else
                        return obj;
                    }));
  }

  public getDocuments(query: Query = new Query()): Observable<T[]> {

    return <Observable<T[]>>
      this._db.collection<T>(this._collectionName,
                             // Execute query builder
                             (s => query.__buildForFireStore(<any> s)) as QueryFn<DocumentData>)
              .snapshotChanges()
              .pipe(map(this._mergeWithDocId));
  }

  public getLatestDocument(query: Query = new Query()): Observable<T[]>
  {
    return <Observable<T[]>>
      this._db.collection(this._collectionName,
                          // Execute query builder
                          (s => query.__buildForFireStore(s).orderBy('createdOn', 'desc').limit(1)) as QueryFn<DocumentData>)
              .snapshotChanges()
              .pipe(map(this._mergeWithDocId));
  }

  /**
   * Creates a document and returns an active document (with DB id attached)
   *
   * @param t
   */
  public create(t: any, setId?: string): Observable<T>
  {
    t.createdOn = new Date();

    const query = this._userService
                      .getUserId()
                      .pipe(take(1),
                            mergeMap(uid =>
                            {
                              t.createdBy = uid;
                              // Turn promise into observable
                              return setId ? this._createWithId<T>(this._db.collection(this._collectionName), setId, t)
                                            : from(this._db.collection<T>(this._collectionName).add(t));
                            }),
    );

    return query.pipe(map((r, i) => { t.id = r.id; return t; }),
                      // Note: https://stackoverflow.com/questions/42704552/rxjs-observable-of-vs-from
                      catchError(e => { throw new Error(e.message); }));
  }

  private _createWithId<T>(collection: AngularFirestoreCollection<T>, id: string, obj: any)
  {
    return from(
      collection.doc(id).ref.get()
        .then(i => {
          if (i.exists)
            throw new Error("Object with that id already exists! Cannot create");

          return collection.doc(id).set(obj).then(_ => collection.doc(id).ref.get());
        }));
  }

  public update(t: T): Observable<T>
  {
    if (!t.id)
      throw new Error("Trying to update POJO-object. Need active document with database id.");

    t.updatedOn = new Date();

    return from(this._db.collection(this._collectionName)
                        .doc(t.id)
                        .update(t))
                        .pipe(take(1),
                              map(() => t),
                              catchError(e => { throw new Error(e.message ); }));
  }

  public write(t: T, id: string): Observable<T>
  {
    t.id = id;
    if(!t.createdOn)
      t.createdOn = new Date();
    else
      t.updatedOn = new Date();

    return from(this._db.collection(this._collectionName)
                        .doc(t.id)
                        .set(t))
                        .pipe(take(1),
                              map(() => t),
                              catchError(e => { throw new Error(e.message ); }));
  }

  public delete(t: T): Observable<T>
  {
    if (!t.id)
      throw new Error("Trying to update POJO-object. Need active document with database id.");

    return from(this._db.collection(this._collectionName)
                        .doc(t.id)
                        .delete())
                        .pipe(take(1),
                              map(() => t),
                              catchError(e => { throw new Error(e.message ); }));
  }

  /** By default, Firebase does not store document id. We therefore merge documents with their id. */
  private _mergeWithDocId(actions: any[]) : T[]
  {
    return actions.map(a => {
      const data = <T> a.payload.doc.data();
      if(data)
        data.id = a.payload.doc.id;

      return data;
    });

  }

  // /**
  //  * Child repository. Repository that links to a sub-collection of specific document.
  //  *
  //  * @param collectionName Child collection name to listen to.
  //  */
  // getChildRepository<Y extends IObject>(docId: string, childCollectionName: string): Repository<Y>
  // {
  //   const document = <AngularFirestoreDocument<T>> this._db.collection(this._collectionName).doc(docId);

  //   return new Repository<Y>(childCollectionName, document, this._userService);
  // }
}
