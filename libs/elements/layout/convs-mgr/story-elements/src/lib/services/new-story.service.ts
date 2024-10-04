import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

import { Story } from '@app/model/convs-mgr/stories/main';
import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { StoryStateService } from '@app/state/convs-mgr/stories';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotsStateService } from '@app/state/convs-mgr/bots';

/** Service which can create new stories. */
@Injectable({ providedIn: 'root' })
export class NewStoryService implements OnDestroy {
  private _sbS = new SubSink();

  constructor(
    private _org$$: ActiveOrgStore,
    private _storyServ$: StoryStateService,
    private _blocksStore$$: StoryBlocksStore,
    private _router: Router,
    private _dialog: MatDialog,
    private _botModulesServ$: BotModulesStateService,
    private _botService: BotsStateService
  ) {}

  /** Save story for the first time */
  saveStory(story: Story, parentModule: BotModule) {
    const bot$ = this._botService.getBotById(parentModule.parentBot);
    const activeOrg$ = this._org$$.get();


    return combineLatest([bot$, activeOrg$]).pipe(take(1), switchMap(([bot, org]) => {
      if (!org) return of(null);
      if (!bot) return of(null);
      
      story.orgId = org.id as string;
      story.parentBot = bot.id as string;

      return this._storyServ$.createStory(story).pipe(
        take(1),
        switchMap((newStory) => {
          return this._botModulesServ$.getBotModuleById(parentModule.id as string).pipe(
            take(1),
            switchMap((bot) => {
              if (!bot) return of(null);  // Handle the case where module is null (should never happen);

              bot.stories.push(newStory.id as string);

              return this._botModulesServ$.updateBotModules(bot as BotModule).pipe(
                tap(() => {
                  this._dialog.closeAll();
                  this._router.navigate(['/stories', newStory.id]);
                  this.createStoryEndBlock(newStory.orgId, newStory.id as string);
                })
              );
            })
          )
        }),
      )
    }))
  }

  /** 2. Update the story details in the Db. */
  updateStory(story: Story, parentModule: BotModule, oldParentModule: string) {
    return this._storyServ$.updateStory(story).pipe(
      take(1),
      switchMap((newStory) => {
        if (story.parentModule !== oldParentModule) {
          this.deleteFromOldParent(story, oldParentModule)
        }

        return this.addNewParent(newStory, parentModule)
      }),
    )
  }

  /** delete story from DB */
  removeStory(story: Story, parentModule:BotModule) {
    return this._storyServ$.deleteStory(story)
  }

  /** delete story from old parentBotModule */
  deleteFromOldParent(story: Story, oldParentModuleId: string) {
    this._sbS.sink = this._botModulesServ$.getBotModuleById(oldParentModuleId).pipe(
      take(1),
      switchMap((botMod) => {
        if (botMod) {
          botMod.stories.filter((modId) => modId !== story.id)
          return this._botModulesServ$.updateBotModules(botMod as BotModule);
        }

        return of(null);
      })
    ).subscribe(() => this._dialog.closeAll())
  }

  /** add parentModule to story */
  addNewParent(newStory: Story, parentModule: BotModule) {
    return this._botModulesServ$.getBotModuleById(parentModule.id as string).pipe(
      take(1),
      switchMap((botModule) => {
        if (!botModule) return of(null); // Handle the case where module is null (should never happen);

        botModule.stories.push(newStory.id as string);

        return this._botModulesServ$.updateBotModules(botModule as BotModule)
      })
    )
  }

  openStory(story: Story) {
    this._dialog.closeAll();
    this._router.navigate(['/stories', story.id]);
    this.createStoryEndBlock(story.orgId, story.id as string);
  }

  createStoryEndBlock(orgId: string, storyId: string) {
    //TODO: offset using element Ref
    const fakeOffsetX =  800;
    const fakeOffsetY = 200;

    const endBlock: EndStoryAnchorBlock = {
      id: 'story-end-anchor',
      type: StoryBlockTypes.EndStoryAnchorBlock,
      position: { x: fakeOffsetX, y: fakeOffsetY},
      deleted: false,
      blockTitle: 'End here',
      blockIcon: '',
      blockCategory:''
    }

    this._sbS.sink = this._blocksStore$$.createEndBlock(orgId, storyId, endBlock).subscribe();
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
