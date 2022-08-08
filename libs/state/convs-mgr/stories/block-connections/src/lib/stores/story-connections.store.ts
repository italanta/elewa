import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

@Injectable()
export class StoryConnectionsStore extends DataStore<any>
{
  protected store = 'story-connections-store';
  protected _activeRepo: Repository<any>;

  private _activeStory: Story;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(_story$$: ActiveStoryStore,
              _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _story$$.get()
                    .pipe(
                      tap((story: Story) => this._activeRepo = _repoFac.getRepo<any>(`orgs/${story.orgId}/stories/${story.id}/connections`)),
                      switchMap((story: Story) => 
                        story ? this._activeRepo.getDocuments() : of([] as any[])),
                      throttleTime(400, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(connections => {
      this.set(connections, 'UPDATE - FROM DB');
    });
  }
}