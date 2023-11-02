import { Injectable, OnDestroy } from '@angular/core';

import { Observable, take } from 'rxjs';

import { StoryBlock, StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';

import { StoryConnectionsStore } from '../stores/story-connections.store';
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root'
})
export class BlockConnectionsService implements OnDestroy {
  private _sbS = new SubSink();

  constructor(private _connections$$: StoryConnectionsStore) { }

  getAllConnections(): Observable<StoryBlockConnection[]> {
    return this._connections$$.get();
  }

  addNewConnections(connections: StoryBlockConnection[]): Observable<StoryBlockConnection[]> {
    return this._connections$$.addMultiple(connections as StoryBlockConnection[], true);
  }

  deleteConnection(connection: StoryBlockConnection) {
    return this._sbS.sink = this._connections$$.remove(connection).subscribe();
  }


  deleteBlockConnections(block: StoryBlock) {
    this.getAllConnections().pipe(take(1)).subscribe((connections: StoryBlockConnection[]) => {

      // Filter out the connections associated with the block
      const remainingConnections = connections.filter(
        (connection) => connection.sourceId !== block.id && connection.targetId !== block.id
      );
      this._connections$$.set(remainingConnections);
    });
  }
  
  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
