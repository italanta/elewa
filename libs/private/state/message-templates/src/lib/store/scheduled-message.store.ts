import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Logger } from '@iote/bricks-angular';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';


import { ActiveOrgStore } from '@app/state/organisation';

import { Organisation } from '@app/model/organisation';
import { ScheduledMessage } from '@app/model/convs-mgr/functions';

@Injectable()
export class ScheduledMessageStore extends DataStore<ScheduledMessage>
{
  protected store = 'scheduled-messages-store';
  protected _activeRepo: Repository<ScheduledMessage>;

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
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<ScheduledMessage>(`orgs/${org.id}/scheduled-messages`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as ScheduledMessage[])
                      ),

                      throttleTime(500, undefined, { leading: true, trailing: true })
                    );

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}