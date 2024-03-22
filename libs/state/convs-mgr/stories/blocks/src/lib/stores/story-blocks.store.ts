/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { combineLatest, of } from 'rxjs'
import { tap, throttleTime, switchMap, map, take } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

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
              private _activeOrgStore$$: ActiveOrgStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const activeOrg$ = this._activeOrgStore$$.get();

    const data$ = combineLatest([activeOrg$,  _story$$.get()])
                    .pipe(
                      tap(([_org, story]) => this._activeStory  = story),
                      tap(([org, story]) => this._activeRepo = _repoFac.getRepo<StoryBlock>(`orgs/${org.id}/stories/${story.id}/blocks`)),
                      switchMap(([_org, story]) => 
                        story ? this._activeRepo.getDocuments() : of([] as StoryBlock[])),
                      throttleTime(400, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }

  write(block: StoryBlock, id: string)
  {
    return this._activeRepo.write(block, id);
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
