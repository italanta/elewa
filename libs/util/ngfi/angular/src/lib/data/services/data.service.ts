import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { IObject, User } from '@iote/bricks';

import { UserService } from '../../auth/services/user.service';

import { BaseDataProvider } from '../db/base.data-provider';
import { DbReference } from '../db/db-reference.type';
import { Repository } from '../repositories/repository.model';

/**
 * Service that creates repositories.
 *
 * Goal: Override this class and create single point of database table configuration.
 */
@Injectable({ providedIn: 'root' })
export class DataService extends BaseDataProvider
{
  /** Hack which exposes not yet supported features by our repositories. */
  public __db: DbReference;

  constructor(_db: AngularFirestore,
              _userService: UserService<User>)
  {
    super (_db, _userService );
    this.__db = this._db;
  }

  /**
   * Newer version of the data service.
   * It makes more sense to store collection names in the services responsible to manage them. We want to get rid
   * of collection definition bottleneck.
   *
   * @param collectionName: The collection name.
   */
  public getRepo<T extends IObject>(collectionName: string): Repository<T> {
    return this._createRepo<T>(collectionName);
  }

}
