import { IObject } from '@iote/bricks';

export class RepositoryCache<T extends IObject>
{
  private _store = [];



  constructor() { }

  find(id: string) {
    return this._store.find(s => s.id === id);
  }

}
