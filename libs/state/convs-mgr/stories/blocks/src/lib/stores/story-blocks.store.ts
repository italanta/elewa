import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap, map, take } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Injectable()
export class StoryBlocksStore extends DataStore<StoryBlock>
{
  protected store = 'story-blocks-store';
  protected _activeRepo: Repository<StoryBlock>;

  private _activeStory: Story;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(private _story$$: ActiveStoryStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _story$$.get()
                    .pipe(
                      tap((story: Story) => this._activeStory  = story),
                      tap((story: Story) => this._activeRepo = _repoFac.getRepo<StoryBlock>(`orgs/${story.orgId}/stories/${story.id}/blocks`)),
                      switchMap((story: Story) => 
                        story ? this._activeRepo.getDocuments() : of([] as StoryBlock[])),
                      throttleTime(400, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }

  addBlocksByStory(storyId: string, orgId: string, blocks: StoryBlock[], isPublished: boolean) 
  {
    const repo = this._repoFac.getRepo<StoryBlock>(`orgs/${orgId}/stories/${storyId}/blocks`);

    if(isPublished) {
      // If the assesment is already published, we need to get the published blocks 
      //    and delete if they are not in the new set of blocks
      const publishedBlocks = this.getBlocksByStory(storyId, orgId);

      const deleteBlocks$ = publishedBlocks.pipe(
        map((publishedBlocks) => {
          publishedBlocks.forEach((publishedBlock) => {
            if(!blocks.find((block) => block.id == publishedBlock.id) && !publishedBlock.id!.includes('feedback')) {
              return repo.delete(publishedBlock);
            } else {
              return of([]);
            }
          });
        })
      )

      deleteBlocks$.subscribe();
    }
    return blocks.map(block => repo.write(block, block.id!));
  }

  getBlocksByStory(storyId: string, orgId?: string)
  {
    orgId = this._activeStory? this._activeStory.orgId : orgId;

    const repo = this._repoFac.getRepo<StoryBlock>(`orgs/${orgId}/stories/${storyId}/blocks`);
    return repo.getDocuments();
  }

  createEndBlock(orgId: string, storyId: string, block: EndStoryAnchorBlock) {
    const blocksRepo = this._repoFac.getRepo<StoryBlock>(`orgs/${orgId}/stories/${storyId}/blocks`);
    return blocksRepo.create(block, block.id);
  }
}
