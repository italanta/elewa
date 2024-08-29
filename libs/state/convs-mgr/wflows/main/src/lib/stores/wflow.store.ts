import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Story } from '@app/model/convs-mgr/stories/main';

import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { WFlow } from '@app/model/convs-mgr/stories/flows';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

@Injectable()
export class FlowsStore extends DataStore<WFlow>
{
  protected store = 'stories-store';
  protected _activeRepo: Repository<WFlow>;

  private _activeOrg: Organisation;
  private _activeStory: Story;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(_org$$: ActiveOrgStore,
              _repoFac: DataService,
              _logger: Logger,
              _story$$: ActiveStoryStore,
            )
  {
    super("always", _logger);

    const story = _story$$.get().pipe(
      tap((story: Story) => this._activeStory = story)
    )

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<WFlow>(`orgs/${org.id}/stories/${this._activeStory.id}/flows`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as WFlow[])),
                      throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }

  publish(story: WFlow){
    // story.publishedOn = new Date();
    return this._activeRepo.write(story, story.id!);
  }
}
