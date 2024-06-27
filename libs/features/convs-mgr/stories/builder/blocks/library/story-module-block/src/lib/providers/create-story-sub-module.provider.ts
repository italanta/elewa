import { v4 as guid } from 'uuid';
import { combineLatest, switchMap, take } from 'rxjs';

import { Injectable } from "@angular/core";

import { BotVersions } from '@app/model/convs-mgr/bots';
import { ActiveStoryStore, StoriesStore } from "@app/state/convs-mgr/stories";

import { Story } from "@app/model/convs-mgr/stories/main";

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { CreateStoryModuleForm } from "../components/create-module-modal/create-module-form";

@Injectable()
export class CreateStorySubModuleProvider
{
  constructor(
    private _org$$: ActiveOrgStore,  
    private _story$$: ActiveStoryStore,
    private _stories$$: StoriesStore)
  { }

  /**
   * Creates a new child-story with the required config.
   * 
   * @param config - Child story config
   * @returns - The created child story
   */
  createSubstory(blockId: string, config: CreateStoryModuleForm)
  {
    return combineLatest(
      [ this._org$$.get().pipe(take(1)),
        this._story$$.get().pipe(take(1))
      ])
      .pipe(
        switchMap(([o, s]) => 
        {
          const story: Story = {
            id: blockId,
            orgId: o.id as string,

            name: config.name,
            description: config.description,
            type: config.type,

            // Set parent story
            parent: s.id,
            
            version: BotVersions.V2Iterator
          };

          return this._stories$$.add(story, story.id);
       }));
  }
}