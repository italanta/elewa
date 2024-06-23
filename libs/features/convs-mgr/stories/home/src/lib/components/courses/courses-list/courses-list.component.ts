import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';
import { Observable, of, switchMap, tap } from 'rxjs';

import { Bot, BotMutationEnum, Course } from '@app/model/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';

import { ConfirmDeleteModalComponent, CreateLessonModalComponent } from '@app/elements/layout/convs-mgr/story-elements';
import { ConfirmArchiveModalComponent, ConfirmPublishModalComponent, MainChannelModalComponent } from '@app/features/convs-mgr/stories/bot-actions';


@Component({
  selector: 'italanta-apps-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent implements OnDestroy 
{
  @Input() courses$: Observable<Course[]>;
  @Input()
  set searchValue(value: string) {
    this.filterString$ = of(value);
  }

  _sBs = new SubSink();

  isPublishing: boolean;
  isUploading: boolean;

  filterString$: Observable<string>;

  constructor(private _dialog: MatDialog, 
              private _snackBar: MatSnackBar,
              private _fileStorageService: FileStorageService) {}

  createLesson(moduleId: string) {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      botModId: moduleId,
    };

    this._dialog.open(CreateLessonModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
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

  deleteBot(bot:Bot){
    this._dialog.open(ConfirmDeleteModalComponent, {
      data: { bot }
    });
  } 

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

   ngOnDestroy(): void {
       this._sBs.unsubscribe();
   }
}
