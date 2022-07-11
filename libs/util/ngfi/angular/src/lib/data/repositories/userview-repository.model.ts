import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/compat/firestore';

import { UserService } from '../../auth/services/user.service';

import { IUserObject, User } from '@iote/bricks';
import { Query } from '@ngfi/firestore-qbuilder';


const USERVIEW_COLLECTION_NAME = 'user-views';

export class UserViewRepository<T extends IUserObject>
{
  constructor(private _collectionName: string,
    private _db: AngularFirestore,
    private _userService: UserService<User>)
  { }

  /**
   * Gets documents owned by user (user_id field == uid).
   */
  public getDocuments(query = new Query()): Observable<T[]>
  {
    return this._userService.getUserId()
                            .pipe(switchMap(uid =>  this.getDocumentsOfUser(uid, query)));
  }

  private getDocumentsOfUser(uid: string, query: Query): Observable<T[]>
  {
    return <Observable<T[]>>
      this._db.collection(
                this._userCollectionPath(uid),
                // Execute query builder
                (s => query.__buildForFireStore(s)) as QueryFn<DocumentData>)
                          .snapshotChanges()
                          .pipe(map(this._mergeWithDocId));
  }

  public getDocumentById(id: string): Observable<T>
  {
    return this._userService.getUserId()
                            .pipe(switchMap(uid => this.getDocumentOfUserById(uid, id)));
  }

  private getDocumentOfUserById(uid: string, id: string)
  {
    return this._db.collection(this._userCollectionPath(uid))
                   .doc(id).snapshotChanges()
                   .pipe(map(d => {
                      const obj = <T> d.payload.data();
                      obj.id = id;
                      return obj;
                   }));
  }

  /** By default, Firebase does not store document id. We therefore merge documents with their id. */
  private _mergeWithDocId(actions: any[]): T[]
  {
    return actions.map(a => {
      const data = <T> a.payload.doc.data();
      data.id = a.payload.doc.id;

      return data;
    });

  }

  private _userCollectionPath(uid: string) {
    return `${USERVIEW_COLLECTION_NAME}/${uid}/${this._collectionName}`;
  }
}
