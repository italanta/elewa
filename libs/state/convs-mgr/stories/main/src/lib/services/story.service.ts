import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Story } from '@app/model/convs-mgr/stories/main';

import { StoriesStore } from '../stores/stories.store';

@Injectable({
  providedIn: 'root',
})
export class StoryStateService {
  constructor(private _StoriesStore$$: StoriesStore) {}

  getStory(): Observable<Story[]> {
    return this._StoriesStore$$.get();
  }

  getStoryById(id: string): Observable<Story> {
    return this._StoriesStore$$.getOne(id);
  }

  createStory(story: Story): Observable<Story> {
    return this._StoriesStore$$.add(story);
  }

  updateStory(story: Story): Observable<Story> {
    return this._StoriesStore$$.update(story);
  }

  deleteStory(story: Story): Observable<Story> {
    return this._StoriesStore$$.remove(story);
  }
}
