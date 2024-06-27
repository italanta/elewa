import { Component, OnInit, OnDestroy} from '@angular/core';

import { SubSink } from 'subsink';
import { combineLatest, map, Observable, take } from 'rxjs';

import {  Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';
import { StoryModuleTypes } from '@app/model/convs-mgr/stories/blocks/structural';

import { ActiveStoryStore, StoriesStore } from '@app/state/convs-mgr/stories';
import { BotVersions } from '@app/model/convs-mgr/bots';

@Component({
  selector: 'convl-builder-nav-bar',
  templateUrl: './builder-nav-bar.component.html',
  styleUrls:  ['./builder-nav-bar.component.scss']
})
export class StoryBuilderNavBarComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  breadcrumbs$: Observable<iTalBreadcrumb[]>;

  constructor(
    private _story$$: ActiveStoryStore,
    private _stories$$: StoriesStore,
    private _logger: Logger) 
  { }

  ngOnInit(): void 
  {
    const allStoriesOnLoad$ = this._stories$$.get().pipe(take(1));

    this.breadcrumbs$ 
      = combineLatest([this._story$$.get(), allStoriesOnLoad$])
            .pipe(map(([activeStory, stories]) => 
              this._initStoryBreadcrumbs(activeStory, stories)));
  }

  /**
   * Initialise the breadcrumb trail for the active story
   */
  private _initStoryBreadcrumbs(story: Story, allStories: Story[]): iTalBreadcrumb[]
  {
    const trailChain = this._unwrapStoryChain(story, allStories);

    const trail = trailChain.map(story => 
      (story.version === BotVersions.V1Modular ? 
          ({ label: story?.name ?? "", link: `/stories/${story?.id}` })
        : ({ label: story?.name ?? "", link: `/stories/${story?.id}` })) as iTalBreadcrumb);

    // Insert dashboard link in front of chain
    return [{
      label: { src: 'assets/svgs/breadcrumbs/bots-stroked.svg' },
      link: `/bots/dashboard`
    } as iTalBreadcrumb].concat(trail);
  }
  
  /**
   * Returns a chain of stories from the current story all the way up to the top parent.
   * Chain sorted from oldest parent to youngest child
   * 
   * @param activeChild - The current story of which we're seeking the top parent.
   */
  private _unwrapStoryChain(activeChild: Story, allStories: Story[], chain: Story[] = []) : Story[]
  {
    // Step 1. Check if current story is top parent.
    if(!activeChild.parent || !activeChild.type || activeChild.type === StoryModuleTypes.Story)
      return [activeChild];

    const parentId = activeChild.parent;
    const parent = allStories.find(s => s.id === parentId);

    if(!parent)
      throw new Error(`Parent is defined but doens't exist.`)

    // Do recursion and find all preceding parents.
    const parents =  this._unwrapStoryChain(parent as Story, allStories, chain);

    // Sort chain from top parent down to child
    return parents.concat([activeChild]);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
