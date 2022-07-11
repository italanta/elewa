// import { Observable, from } from 'rxjs';
// import { flatMap, map, catchError } from 'rxjs/operators';
// import { AngularFirestore } from '@angular/fire/firestore';

// import { IObject, User } from '@iote/bricks';

// import { UserService } from '../../auth/services/user.service';

// import { Repository } from './repository.model';

// export class RepositoryStore<T extends IObject> extends Repository<T>
// {
//   private _cache = [];

//   constructor(protected _collectionName: string,
//               protected _db: AngularFirestore,
//               protected _userService: UserService<User>,
//               protected useStore = true)
//   {
//     super(_collectionName, _db, _userService, )
//   }


//   public getDocumentById(id: string): Observable<T>
//   {
//     if(this._cache.find(id))
//       return this.
//     return this._db.collection(this._collectionName)
//                    .doc(id).snapshotChanges()
//                    .pipe(map(d => {
//                       const obj = <T> d.payload.data();
//                       if(obj) {
//                         obj.id = id;
//                         return obj;
//                       }
//                       else
//                         return obj;
//                     }));
//   }
// }
