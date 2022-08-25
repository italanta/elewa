import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';

import { StoryConnectionsStore } from '../stores/story-connections.store';

@Injectable({
  providedIn: 'root'
})
export class BlockConnectionsService {

  constructor(private _connections$$: StoryConnectionsStore) { }

  getAllConnections(): Observable<StoryBlockConnection[]> {
    return this._connections$$.get();
  }

  addNewConnections(connections: StoryBlockConnection[]): Observable<StoryBlockConnection[]> {
    return this._connections$$.addMultiple(connections as StoryBlockConnection[], true);
  }
}
