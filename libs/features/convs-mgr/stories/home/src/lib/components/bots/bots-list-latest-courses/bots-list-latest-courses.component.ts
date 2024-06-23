import { orderBy as __orderBy } from 'lodash';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';
import { Observable, map, of, switchMap, tap } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';
import { ConfirmDeleteModalComponent, DeleteElementsEnum } from '@app/elements/layout/convs-mgr/story-elements';

import { MainChannelModalComponent } from '@app/features/convs-mgr/stories/bot-actions';
import { ConfirmPublishModalComponent } from '@app/features/convs-mgr/stories/bot-actions';
import { ConfirmArchiveModalComponent } from '@app/features/convs-mgr/stories/bot-actions';

@Component({
  selector: 'italanta-apps-bots-list-latest-courses',
  templateUrl: './bots-list-latest-courses.component.html',
  styleUrls: ['./bots-list-latest-courses.component.scss'],
})
export class BotsListLatestCoursesComponent implements OnInit, OnDestroy
{

  @Input() bots$: Observable<Bot[]>;

  private _sBs = new SubSink();

  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`;

  bots: Bot[];

  uploadMedia: boolean;

  isUploading: boolean;

  screenWidth: number;

  isPublishing: boolean;

  constructor(
    private _router$$: Router, 
    private _dialog: MatDialog,
    private _fileStorageService: FileStorageService,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void
  {

    this.screenWidth = window.innerWidth;

    if (this.bots$) {
      this._sBs.sink = this.bots$.pipe(
        map((s) => __orderBy(s, (a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
    }
  }

  connectToChannel(bot: Bot)
  {
    this._dialog.open(MainChannelModalComponent, {
      data: { bot }
    });
  }
  
  publishBot(bot:Bot){
    this.isPublishing = true;

    const dialogRef = this._dialog.open(ConfirmPublishModalComponent, {
      data: { bot }
    });

    const published$ = dialogRef.afterClosed();

    this._sBs.sink = published$.pipe(tap((published)=> {
      if(published) {
        this.isPublishing = false;
      }
    }), 
      switchMap(() => {
        if(bot.linkedChannel) {
          this.isUploading = true;
          return this._fileStorageService.uploadMediaToPlatform(bot);
        } else {
          return of(null);
        }
      })).subscribe((result)=> {
          this.isUploading = false;
          if(result.success) {
            this.openSnackBar('Media upload successful', 'OK');
          } else {
            // Show failure due to linked channel
            this.openSnackBar('Media upload failed. Confirm channel details', 'OK');
          }
        })
  }

  archiveBot(bot: Bot) 
  {
    this._dialog.open(ConfirmArchiveModalComponent, {
      data: { bot }
    });
  }

  openBot(id: string)
  {
    this._router$$.navigate(['bots', id]);
  }

  deleteBot(bot:Bot){
    this._dialog.open(ConfirmDeleteModalComponent, {
      data: { 
        mode: DeleteElementsEnum.BotModule, element: bot,
      }
    });
  } 

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnDestroy(): void
  {
    this._sBs.unsubscribe();
  }
}
