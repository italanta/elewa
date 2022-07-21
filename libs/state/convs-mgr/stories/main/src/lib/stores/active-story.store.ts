import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Story } from '@app/model/convs-mgr/stories/main';

import { StoriesStore } from './stories.store';

@Injectable()
export class ActiveStoryStore extends Store<Story>
{
  protected store = 'active-story-store';
  _activeStory : string;

  constructor(private _stories$$: StoriesStore,
              _router: Router)
  {
    super(null as any);

    const stories$ = _stories$$.get();
    const route$ = _router.events.pipe(filter((ev) => ev instanceof NavigationEnd),
                                       map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([stories$, route$])
                        .subscribe(([stories, route]) =>
    {
      const storyId = this._getRoute(route);

      if(storyId !== '__noop__')
      {
        const st = stories.find(o => o.id === storyId);

        if(st && this._activeStory !== storyId)
        {
          this._activeStory = storyId;
          this.set(st, 'UPDATE - FROM DB || ROUTE');
        }
      }
    });
  }

  private _getRoute(route: NavigationEnd) : string
  {
    const elements = route.url.split('/');
    const storyId = elements.length >= 3 ? elements[2] : '__noop__';

    return storyId;
  }

  override get = () => super.get().pipe(filter(val => val != null));

  update = (story: Story) => this._stories$$.update(story);
}
