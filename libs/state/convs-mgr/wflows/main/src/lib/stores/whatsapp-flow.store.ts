import { Injectable } from '@angular/core';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';
import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Story } from '@app/model/convs-mgr/stories/main';

import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { WFlow } from '@app/model/convs-mgr/stories/flows';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

@Injectable({providedIn: 'root'})
export class WhatsappFlowsStore extends DataStore<WFlow>
{
  protected store = 'flows-store';
  protected _activeRepo: Repository<WFlow>;

  private _activeOrg: Organisation;
  private _activeStory: Story;
  
  constructor(_org$$: ActiveOrgStore,
              _repoFac: DataService,
              _logger: Logger,
              _story$$: ActiveStoryStore,
            )
  {
    super("always", _logger);

    const story$ = _story$$.get();
    const org$ = _org$$.get();

    const data$ = story$.pipe(tap((story: Story)=> this._activeStory = story), 
                switchMap(()=> org$),
                tap((org: Organisation)=> this._activeOrg = org),
                tap((org: Organisation)=> this._activeRepo = _repoFac.getRepo<WFlow>(`orgs/${org.id}/stories/${this._activeStory.id}/flows`)),

                switchMap((org) => org ? this._activeRepo.getDocuments() : of([] as WFlow[])),
                throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
