import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { take } from 'rxjs/operators';

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

import { ToastService } from '@iote/bricks-angular';
import { TranslateService } from '@ngfi/multi-lang';

import { Story } from '@app/model/convs-mgr/stories/main';
import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveOrgStore } from '@app/state/organisation';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { FileStorageService } from '@app/state/file';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

/** Service which can create new stories. */
@Injectable()
export class NewStoryService implements OnDestroy {
  private _sbS = new SubSink();

  constructor(
    private _org$$: ActiveOrgStore,
    private _stories$$: StoriesStore,
    private _blocksStore$$: StoryBlocksStore,
    private _fileStorageService$$: FileStorageService,
    private _router: Router,
    private _toast: ToastService,
    private _translate: TranslateService,
    private _dialog: MatDialog
  ) {}

  /** Save story for the first time */
  async saveStory(story: Story, storyImage?: File, storyImagePath?: string) {
    // first Upload and patch image src value if it was provided.
    if (storyImage && storyImagePath) {
      const res = await this._fileStorageService$$.uploadSingleFile(storyImage, storyImagePath);

      this._sbS.sink = res.pipe(take(1)).subscribe(url  => {
        story.imageField = url
        this.addStoryToDb(story);
      });

    } else {
      this.addStoryToDb(story);
    }
  }

  // 2. Add the story to DB with all values
  addStoryToDb(story: Story) {
    this._org$$.get().pipe(take(1)).subscribe((org) => {
      if (org) {
        story.orgId = org.id as string;
        this._sbS.sink = this._stories$$.add(story).subscribe((story) => {
          if (story) {
            this._dialog.closeAll();
            this._router.navigate(['/stories', story.id])
            this.createStoryEndBlock(story.orgId, story.id as string);
          }
        });
      }
    });
  }

   /** Update a stories values */
  async updateStory(story: Story, storyImage?: File, storyImagePath?: string) {
    // first Upload and patch image src values if it was provided.
    if (storyImage && storyImagePath) {
      //delete the image if any
      if (story.imageField && story.imageField != '') {
        this._fileStorageService$$.deleteSingleFile(story.imageField).subscribe(() => story.imageField = '');
      }

      const res = await this._fileStorageService$$.uploadSingleFile(storyImage, storyImagePath);

      this._sbS.sink = res.pipe(take(1)).subscribe(url => {
        story.imageField = url;
        this.updateStoryDetails(story);
      });

    } else {
      this.updateStoryDetails(story)
    }
  }

  // 2. Update the story details in the Db.
  updateStoryDetails(story: Story) {
    this._sbS.sink = this._stories$$.update(story).subscribe((botSaved) => {
      if (botSaved) {
        this._dialog.closeAll();
        this._toast.doSimpleToast(
          this._translate.translate('TOAST.EDIT-BOT.SUCCESSFUL')
        );
      } else {
        this._toast.doSimpleToast(
          this._translate.translate('TOAST.EDIT-BOT.FAIL')
        );
      }
    });
  }

  removeStory(story: Story) {
    this._sbS.sink = this._stories$$.remove(story).subscribe({
      error: () => {
        this._toast.doSimpleToast(
          this._translate.translate('TOAST.DELETE-BOT.FAIL')
        );
      },
      complete: () => {
        this._dialog.closeAll();
        this._toast.doSimpleToast(
          this._translate.translate('TOAST.DELETE-BOT.SUCCESSFUL')
        );
      },
    });
  }

  createStoryEndBlock(orgId: string, storyId: string) {
    //TODO: offset using element Ref
    const fakeOffsetX = (20000/2 + 800)
    const fakeOffsetY = (20000/2)

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

  generateName() {
    const defaultName = uniqueNamesGenerator({dictionaries: [adjectives, colors, animals],});
    return defaultName;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
