import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

@Injectable()
export class StoryConnectionsStore extends DataStore<StoryBlockConnection>
{
  protected store = 'story-connections-store';
  protected _activeRepo: Repository<StoryBlockConnection>;

  constructor(_story$$: ActiveStoryStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _story$$.get()
                    .pipe(
                      tap((story: Story) => this._activeRepo = _repoFac.getRepo<StoryBlockConnection>(`orgs/${story.orgId}/stories/${story.id}/connections`)),
                      switchMap((story: Story) =>
                        story ? this._activeRepo.getDocuments() : of([] as any[])),
                      throttleTime(400, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(connections => {
      this.set(connections, 'UPDATE - FROM DB');
    });
  }

  addConnectionsByStory(storyId: string, orgId: string, connections: StoryBlockConnection[]){
    const repo = this._repoFac.getRepo<StoryBlockConnection>(`orgs/${orgId}/stories/${storyId}/connections`);

    return connections.map(connection => repo.write(connection, connection.id!));
  }
}
