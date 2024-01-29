import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { combineLatest, of } from 'rxjs'
import { tap, throttleTime, switchMap, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable()
export class StoryConnectionsStore extends DataStore<StoryBlockConnection>
{
  protected store = 'story-connections-store';
  protected _activeRepo: Repository<StoryBlockConnection>;

  constructor(_story$$: ActiveStoryStore,
              private _activeOrgStore$$: ActiveOrgStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const activeOrg$ = this._activeOrgStore$$.get();

    const data$ = combineLatest([activeOrg$,  _story$$.get()])
                .pipe(
                  tap(([org, story]) => this._activeRepo = _repoFac.getRepo<StoryBlockConnection>(`orgs/${org.id}/stories/${story.id}/connections`)),
                  switchMap(([_org, story]) => 
                    story ? this._activeRepo.getDocuments() : of([] as StoryBlockConnection[])),
                  throttleTime(400, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(connections => {
      this.set(connections, 'UPDATE - FROM DB');
    });
  }

  /** Make sure to only load connections that have not been deleted */
  override get() {
    return super.get().pipe(map(conns => conns.filter(conn => !conn.deleted)));
  }

  /** Turns an assessment into a story. Adds its connections */
  addConnectionsByStory(storyId: string, orgId: string, connections: StoryBlockConnection[], isPublished: boolean)
  {
    const repo = this._repoFac.getRepo<StoryBlockConnection>(`orgs/${orgId}/stories/${storyId}/connections`);

    if(isPublished) {
      // If the assesment is already published, we need to get the published connections
      //    and delete if they are not in the new set of blocks
      const publishedConnections = this.getConnectionsByStory(storyId, orgId);

      const deleteConnections$ = publishedConnections.pipe(
        map((publishedConnections) => {
          publishedConnections.forEach((publishedConn) => {
            if(!connections.find((conn) => conn.id == publishedConn.id) && !publishedConn.id!.includes('feedback') ) {
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
