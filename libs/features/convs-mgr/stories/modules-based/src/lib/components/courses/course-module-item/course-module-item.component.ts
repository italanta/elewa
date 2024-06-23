import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog  } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';

import { BotsStateService } from '@app/state/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';

import { DeleteElementsEnum, CreateLessonModalComponent, ConfirmDeleteModalComponent } from '@app/elements/layout/convs-mgr/story-elements';
import { ConnectToChannelModalComponent } from '@app/features/convs-mgr/stories/bot-actions';


@Component({
  selector: 'italanta-apps-course-module-item',
  templateUrl: './course-module-item.component.html',
  styleUrls: ['./course-module-item.component.scss'],
})
export class CourseModuleItemComponent implements OnDestroy {
  @Input() botModule: BotModule;
  @Input() story: Story;

  _sBs = new SubSink();
  isPublishing :boolean;

  uploadMedia: boolean;

  constructor(private _dialog: MatDialog,
              private _botsService$: BotsStateService, 
              private _router$: Router,
              private _fileStorageService: FileStorageService) {}

  specificBot: Bot | undefined; /**adding undefined here since it is described that way in the store service, removing might break something, check on this */

  openModule(id: string) {
    this._router$.navigate(['modules', id]);
  }

  openLesson(id: string) {
    this._router$.navigate(['stories', id]);
  }

  editLesson(story: Story) {
    this._dialog
      .open(CreateLessonModalComponent, {
        minWidth: '600px',
        data: {
          botMode: BotMutationEnum.EditMode,
          story: story,
        },
      })
      .afterClosed();
  }

  deleteLesson(story: Story) {
    this._dialog.open(ConfirmDeleteModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.Story, element: story, parentElement:story.parentModule
      }
    }).afterClosed();
  }

  connectToChannel(botId: string) {
    this._dialog.open(ConnectToChannelModalComponent,{
      width: '30rem',
       height: '20rem',
       data: { botId: botId }
    });
   }
  deleteBot(botId:Bot){
    this._botsService$.deleteBot(botId)
  } 

  archiveBot(bot:Bot){
    bot.isArchived = true;
    this._botsService$.updateBot(bot)
  }

  publishBot(bot:Bot){
    this.isPublishing = true;
    bot.isPublished = true;

    this._sBs.sink = this._botsService$.updateBot(bot)
      .subscribe(() => {
        this.isPublishing = false;
      });

    if (this.uploadMedia && bot.linkedChannel) {
      this._sBs.sink = this._fileStorageService.uploadMediaToPlatform(bot).subscribe()
    }
  }

  ngOnDestroy() {
    this._sBs.unsubscribe()
  }
}
