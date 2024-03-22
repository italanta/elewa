import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { Story } from '@app/model/convs-mgr/stories/main';

import { StoriesStore } from '../stores/stories.store';

@Injectable({
  providedIn: 'root',
})
export class StoryStateService {
  constructor(private _StoriesStore$$: StoriesStore) {}

  getStories(): Observable<Story[]> {
    return this._StoriesStore$$.get();
  }

  getMultipleStories(storyIds: string[]): Observable<Story[]>{
    return this._StoriesStore$$.getMany(storyIds);
  }

  getStoriesFromParentModule(moduleId: string): Observable<Story[]> {
    return this._StoriesStore$$.get().pipe(
      map(stories => 
          stories
            .filter(story => story.parentModule === moduleId)
            .sort((a, b) => (a.name as string)?.localeCompare(b.name as string))
        )
    );
  }

  getStoryById(id: string): Observable<Story | undefined> {
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
