import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap, map } from 'rxjs/operators';

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

  addConnectionsByStory(storyId: string, orgId: string, connections: StoryBlockConnection[], isPublished: boolean){
    const repo = this._repoFac.getRepo<StoryBlockConnection>(`orgs/${orgId}/stories/${storyId}/connections`);

    if(isPublished) {
      // If the assesment is already published, we need to get the published connections
      //    and delete if they are not in the new set of blocks
      const publishedConnections = this.getConnectionsByStory(storyId, orgId);

      const deleteConnections$ = publishedConnections.pipe(
        map((publishedConnections) => {
          publishedConnections.forEach((publishedConn) => {
            if(!connections.find((conn) => conn.id == publishedConn.id)) {
              return repo.delete(publishedConn);
            } else {
              return of([]);
            }
          });
        })
      )

      deleteConnections$.subscribe();
    }

    return connections.map(connection => repo.write(connection, connection.id!));
  }

  getConnectionsByStory(storyId: string, orgId: string) {
    const repo = this._repoFac.getRepo<StoryBlockConnection>(`orgs/${orgId}/stories/${storyId}/connections`);
    return repo.getDocuments();
  }
}
