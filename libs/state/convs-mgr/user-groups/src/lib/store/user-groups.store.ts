import { userGroups } from '@app/model/convs-mgr/user-groups';

import { Injectable } from '@angular/core';
import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { ActiveOrgStore } from '@app/private/state/organisation/main';


import { Organisation } from '@app/model/organisation';

@Injectable()
export class userGroupsStore extends DataStore<userGroups>
{
  protected store = 'usergroup-store';
  protected _activeRepo: Repository<userGroups>;

  private _activeOrg: Organisation;
  
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
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<userGroups>(`orgs/${org.id}/classes`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([]as userGroups[])
                      ),

                      throttleTime(500, undefined, { leading: true, trailing: true })
                    );

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
