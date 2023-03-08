import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

@Injectable()
export class StoryConnectionsStore extends DataStore<StoryBlockConnection>
{
  protected store = 'story-connections-store';
  protected _activeRepo: Repository<StoryBlockConnection>;

  constructor(_story$$: ActiveStoryStore,
              _repoFac: DataService,
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

  deleteBlockConnections(block: StoryBlock){
    const blockId = block.id?.toString() as string
    let connections: StoryBlockConnection[] = []

    this._sbS.add(
      this.get().subscribe(_connections => {
        connections = _connections.filter(conn => conn.sourceId.endsWith(blockId) || conn.targetId === blockId);
        // Delete from store
        this.removeMultiple(connections);
      })
    );
  }
}
