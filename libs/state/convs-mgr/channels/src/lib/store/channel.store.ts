import { Injectable } from '@angular/core';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';
import { Query } from '@ngfi/firestore-qbuilder';
import { Logger } from '@iote/bricks-angular';

import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { Organisation } from '@app/model/organisation';

@Injectable()
export class ChannelsStore extends DataStore<CommunicationChannel>
{
  protected store = 'channels-store';
  protected _activeRepo: Repository<CommunicationChannel>;

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

    const query = (OrgId: string) => new Query().where("orgId", "==", OrgId);

    const data$ = this._org$$.get()
                    .pipe (
                      tap((org: Organisation) => this._activeOrg = org),
                      tap(() => this._activeRepo = _repoFac.getRepo<CommunicationChannel>(`channels`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments(query(org.id as string)) : of([] as CommunicationChannel[])
                      ),

                      throttleTime(500, undefined, { leading: true, trailing: true })
                    );

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
