import { Injectable } from '@angular/core';
import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { ActiveOrgStore } from '@app/state/organisation';

import { Organisation } from '@app/model/organisation';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';

@Injectable()
export class EndUsersStore extends DataStore<EndUser>
{
  protected store = 'end-users-store';
  protected _activeRepo: Repository<EndUser>;

  private _activeOrg: Organisation;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.

  constructor (
    private _org$$: ActiveOrgStore, 
    private _repoFac: DataService,  
    _logger: Logger
  )
  {
    super("always", _logger);

    const data$ = this._org$$.get()
                    .pipe (
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<EndUser>(`orgs/${org.id}/end-users`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as EndUser[])
                      ),

                      throttleTime(500, undefined, { leading: true, trailing: true })
                    );

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }

  getUserName(id: string) {
    const namesRepo = this._repoFac.getRepo<any>(`orgs/${this._activeOrg.id}/end-users/${id}/variables`);

    const valuesDoc$ = namesRepo.getDocumentById('values');

    return valuesDoc$;
  }

  getCurrentCursor(id: string) {
    const cursorRepo = this._repoFac.getRepo<Cursor>(`orgs/${this._activeOrg.id}/end-users/${id}/cursor`);

    const latestCursor$ = cursorRepo.getLatestDocument();

    return latestCursor$;
  }
}
