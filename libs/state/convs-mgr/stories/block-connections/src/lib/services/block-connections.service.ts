import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Injectable, OnDestroy } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable, take } from 'rxjs';

import { StoryBlock, StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

import { StoryConnectionsStore } from '../stores/story-connections.store';
import { DeleteConnectors } from '../utils/delete-connections.jsplumb';

@Injectable({
  providedIn: 'root'
})
export class BlockConnectionsService implements OnDestroy {
  private _sbS = new SubSink();

  constructor(private _connections$$: StoryConnectionsStore, private _story$$: ActiveStoryStore) { }

  getAllConnections(): Observable<StoryBlockConnection[]> {
    return this._connections$$.get();
  }

  // addNewConnections(connections: StoryBlockConnection[]): Observable<StoryBlockConnection[]> {
  //   return this._connections$$.addMultiple(connections as StoryBlockConnection[], true);
  // }

  /**
   * Quick fix for the story editor issue. This function overwrites the current connection 
   *    when saving if it already exists
   * 
   * TODO: Fix the actual state issue which results in the story editor trying to create blocks
   *   and connections which already exist.
   */
  addNewConnections(connections: StoryBlockConnection[]) {
    const newConnections = connections.map((conn)=> this._connections$$.writeConnection(conn));

    return newConnections;
  }

  deleteConnection(connection: StoryBlockConnection) {
    return this._sbS.sink = this._connections$$.remove(connection).subscribe();
  }


  deleteBlockConnections(block: StoryBlock, jsPlumb: BrowserJsPlumbInstance,) {
    this.getAllConnections().pipe(take(1)).subscribe((connections: StoryBlockConnection[]) => {

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
