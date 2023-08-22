

import { combineLatest, Observable, of } from 'rxjs';

import { AccessRights } from '@app/private/model/access-control';

import { map } from 'rxjs/operators';

export abstract class AccessQuery
{
  getRights() : Observable<AccessRights>
  {
    return combineLatest([this._hasWriteAccess(),
                          this._hasReadAccess(),
                          this._hasViewAccess(),
                          this._hasDeleteAccess()])
      .pipe(
        map(([wA, rA, vA, dA]) =>
        {
          if(wA) return AccessRights.Write;
          else if(rA) return AccessRights.Read;
          else if(vA) return AccessRights.View;
          else if (dA) return AccessRights.Delete;
          else
            return AccessRights.None;
        }
      ));
  }

  /**
   * Predicate for write access class requirements. */
  protected _hasWriteAccess() { return of(false); }

  /**
   * Predicate for read access class requirements. */
  protected _hasReadAccess()  { return of(false); }

  /**
   * Predicate for read access class requirements. */
  protected _hasViewAccess()  { return of(false); }

  /**
   * Predicate for read access class requirements. */
  protected _hasDeleteAccess()  { return of(false); }
}