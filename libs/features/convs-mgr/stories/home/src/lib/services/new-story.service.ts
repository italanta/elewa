import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { take, map, switchMap, tap } from "rxjs/operators";

import { Injectable, OnDestroy  } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SubSink } from 'subsink';

import { ToastService } from '@iote/bricks-angular';
import { TranslateService } from '@ngfi/multi-lang';
import { Story } from "@app/model/convs-mgr/stories/main";

import { ActiveOrgStore } from "@app/state/organisation";
import { StoriesStore } from "@app/state/convs-mgr/stories";
import { FileStorageService } from "libs/state/file/store/src/lib/providers/file-storage.service";
import { Organisation } from "@app/model/organisation";

/** Service which can create new stories. */
@Injectable()
export class NewStoryService implements OnDestroy
{
  constructor(private _org$$: ActiveOrgStore,
              private _stories$$: StoriesStore,
              private _fileStorageService$$: FileStorageService,
              private _router: Router,
              private _toast: ToastService,
              private _translate: TranslateService,
              private _dialog: MatDialog)
  {}
  private _sbS = new SubSink();

  async saveStoryWithImage(bot: Story, imageFile: File, imagePath: string) {
    this._org$$.get().pipe(take(1)).subscribe(async (org) => {
      if (org) {
        await this.saveBot(bot, org.id!, imageFile, imagePath)
      }
    })
  }
  async saveImage(imageFile: File, imagePath: string) {
    let savedImage = await this._fileStorageService$$.uploadSingleFile(imageFile, imagePath);
    let url = await savedImage.getDownloadURL();
    return url;
  }
  // add(bot: Story) {
  //   return this._getOrgId$().pipe(
  //               switchMap(async (orgId) => await this.saveBot(bot, orgId!)))
  // }
  saveImagelessStory(bot:Story){
    this._org$$.get().pipe(take(1)).subscribe(async (org) => {
      if (org) {
       this.callableAddFunction(bot)
      }
    })
 }
  async saveBot(bot: Story, orgId: string, storyImage?: File, storyImagePath?: string) {
    bot.orgId = orgId!;

    if (storyImagePath) {
      bot.imageField = await this.saveImage(storyImage!, storyImagePath);
      this.callableAddFunction(bot); 
    }
  }
  callableAddFunction(bot:Story){
    this._stories$$.add(bot).subscribe((story) => {
      this._dialog.closeAll();
      this._router.navigate(['/stories', story.id])
    });
  }
  deleteImage(imagePath: string) {
    this._fileStorageService$$.deleteSingleFile(imagePath);
  }
  async update(bot: Story, storyImage?: File, storyImagePath?: string) {

    if (bot.imageField) {
      //delete the image if any
      this.deleteImage(bot.imageField);
      bot.imageField='';
      //Check if storyimagepath has a value
      if(storyImagePath){
  //update the image
      bot.imageField = await this.saveImage(storyImage!, storyImagePath);
      }
      this._stories$$.update(bot).subscribe(() => {
        try {
          this._dialog.closeAll();
          this._toast.doSimpleToast(this._translate.translate('TOAST.EDIT-BOT.SUCCESSFUL'));
        } catch (error) {
          this._toast.doSimpleToast(this._translate.translate('TOAST.EDIT-BOT.FAIL'));
        }
      });
     
    }
    
  }

  remove(story: Story) {
    this._sbS.sink = this._stories$$.remove(story).subscribe({
      error: () => {
        this._toast.doSimpleToast(
          this._translate.translate("TOAST.DELETE-BOT.SUCCESSFUL")
        );
      },
      complete: () =>  {
        this._dialog.closeAll()
        this._toast.doSimpleToast(
          this._translate.translate("TOAST.DELETE-BOT.FAIL")
        );
      },
    });
  }

  private _getOrgId$ = () => this._org$$.get().pipe(take(1), map(o => o.id));

  generateName(){
    const defaultName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    return defaultName;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
