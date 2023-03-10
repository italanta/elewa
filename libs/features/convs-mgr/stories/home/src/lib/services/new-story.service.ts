import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

import { SubSink } from 'subsink';

import { take, map } from "rxjs/operators";

import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";

import { ToastService } from '@iote/bricks-angular';
import { TranslateService } from '@ngfi/multi-lang';

import { Story } from "@app/model/convs-mgr/stories/main";
import { EndStoryAnchorBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { ActiveOrgStore } from "@app/state/organisation";
import { StoriesStore } from "@app/state/convs-mgr/stories";
import { FileStorageService } from "@app/state/file";
import { StoryBlocksStore } from "@app/state/convs-mgr/stories/blocks";


/** Service which can create new stories. */
@Injectable()
export class NewStoryService implements OnDestroy {
  private _sbS = new SubSink();

  constructor(private _org$$: ActiveOrgStore,
              private _stories$$: StoriesStore,
              private _blocksStore$$: StoryBlocksStore,
              private _fileStorageService$$: FileStorageService,
              private _router: Router,
              private _toast: ToastService,
              private _translate: TranslateService,
              private _dialog: MatDialog
  ) { }

  async saveStoryWithImage(bot: Story, imageFile: File, imagePath: string) {
    await this.saveBotImage(bot, imageFile, imagePath)
  }

  async saveImage(imageFile: File, imagePath: string) {
    let savedImage = await this._fileStorageService$$.uploadSingleFile(imageFile, imagePath);
    let url = await savedImage;
    return url;
  }

  saveImagelessStory(bot: Story) {
    this.addStoryToDb(bot)
  }

  async saveBotImage(bot: Story, storyImage?: File, storyImagePath?: string) {
    if (storyImagePath) {
      // bot.imageField = await this.saveImage(storyImage!, storyImagePath);
      this.addStoryToDb(bot);
    }
  }

  addStoryToDb(bot: Story) {
    this._org$$.get().pipe(take(1)).subscribe(async (org) => {
      if (org) {
        bot.orgId = org.id!;
        this._stories$$.add(bot).subscribe((story) => {
          if (story) {
            this._dialog.closeAll();
            this._router.navigate(['/stories', story.id]),
            this.createStoryEndBlock(story.orgId, story.id!);
          }
        });
      }
    })
  }

  deleteImage(imagePath: string) {
    this._fileStorageService$$.deleteSingleFile(imagePath);
  }

  async update(bot: Story, storyImage?: File, storyImagePath?: string) {

    if (storyImage) {
      //delete the image if any
      if (bot.imageField && bot.imageField != '') {
        this.deleteImage(bot.imageField!);
        bot.imageField = '';
      }

      // bot.imageField = await this.saveImage(storyImage!, storyImagePath!);
    }

    this._stories$$.update(bot).subscribe((botSaved) => {
      if (botSaved) {
        this._dialog.closeAll();
        this._toast.doSimpleToast(this._translate.translate('TOAST.EDIT-BOT.SUCCESSFUL'));
      } else {
        this._toast.doSimpleToast(this._translate.translate('TOAST.EDIT-BOT.FAIL'));
      }
    });
  }

  remove(story: Story) {
    this._sbS.sink = this._stories$$.remove(story).subscribe({
      error: () => {
        this._toast.doSimpleToast(
          this._translate.translate("TOAST.DELETE-BOT.SUCCESSFUL")
        );
      },
      complete: () => {
        this._dialog.closeAll()
        this._toast.doSimpleToast(
          this._translate.translate("TOAST.DELETE-BOT.FAIL")
        );
      },
    });
  }

  createStoryEndBlock(orgId: string, storyId: string) {
    let endBlock: EndStoryAnchorBlock = {
      id: 'story-end-anchor',
      type: StoryBlockTypes.EndStoryAnchorBlock,
      position: {x: 200, y: 100},
      deleted: false,
      blockTitle: 'End here',
      blockIcon: ''
    }
    this._blocksStore$$.createEndBlock(orgId, storyId, endBlock);
  }

  private _getOrgId$ = () => this._org$$.get().pipe(take(1), map(o => o.id));

  generateName() {
    const defaultName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    return defaultName;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
