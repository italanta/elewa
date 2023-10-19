import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Bot } from '@app/model/convs-mgr/bots';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable()
export class BotsStore extends DataStore<Bot>
{
  protected store = 'bots-store';
  protected _activeRepo: Repository<Bot>;

  private _activeOrg: Organisation;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(_org$$: ActiveOrgStore,
              _repoFac: DataService,
              _logger: Logger
  ) {
    super("always", _logger);

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<Bot>(`orgs/${org.id}/bots`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as Bot[])
                      ),
                      throttleTime(500, undefined, { leading: true, trailing: true })
                    );

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
