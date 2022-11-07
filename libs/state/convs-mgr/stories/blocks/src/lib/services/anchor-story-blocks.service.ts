import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';

import { of } from 'rxjs';
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { StoryBlocksStore } from '../stores/story-blocks.store';

@Injectable()
export class AnchorBlockService {
  protected _activeRepo: Repository<StoryBlock>;

  private _activeStory: Story;

  constructor(private _blocks$$: StoryBlocksStore) {}

  /**
   * Create a default anchor block with the story id
   * @param storyId - Id of the story
   * @returns 
   */
  create(storyId: string) {

    const anchorBlock = { 
        id: storyId, 
        type: StoryBlockTypes.AnchorBlock, 
        position: { x: 5, y: 5 } 
    } as StoryBlock;
    
    return this._blocks$$.add(anchorBlock, anchorBlock.id)
  }
}
