import { Injectable, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

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
    return this._connections$$.remove(connection).subscribe();
  }

  deleteBlockConnections(block: StoryBlock){
    this._connections$$.deleteBlockConnections(block);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
