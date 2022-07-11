import { User, IObject } from '@iote/bricks';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { UserService } from '../../auth/services/user.service';

import { Repository } from '../repositories/repository.model';

/**
 * Base Repository Factory for repositories of a certain application domain.
 */
export abstract class BaseDataProvider
{
  constructor(protected _db: AngularFirestore,
              protected _userService: UserService<User>)
  {}

  protected _createRepo<T extends IObject>(collectionName: any) {
    return new Repository<T>(collectionName, this._db, this._userService);
  }
}
