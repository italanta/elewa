import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { Observable, of } from 'rxjs';

import { CreateLessonModalComponent } from '@app/elements/layout/convs-mgr/story-elements';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { Course } from '../../../model/courses.interface';
import { MainChannelModalComponent } from '../../../modals/main-channel-modal/main-channel-modal.component';

@Component({
  selector: 'italanta-apps-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent implements OnDestroy {
  @Input() courses$: Observable<Course>;
  @Input()
  set searchValue(value: string) {
    this.filterString$ = of(value);
  }

  _sBs = new SubSink();

  filterString$: Observable<string>;

  constructor(private _dialog: MatDialog, private _botsService$: BotsStateService) {}

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

  connectToChannel(botId: string)
  {
    this._dialog.open(MainChannelModalComponent, {
      width: '30rem',
      height: '27rem',
      data: { botId: botId }
    });
  }

  publishBot(bot:Bot){
    bot.isPublishing = true;
    this._sBs.sink = this._botsService$.publishBot(bot)
      .subscribe(() => {
        bot.isPublishing = false;
      });
  }

  archiveBot(bot:Bot){
    this._sBs.sink = this._botsService$.archiveBot(bot).subscribe();
  }

   deleteBot(bot:Bot){
    this._sBs.sink = this._botsService$.deleteBot(bot).subscribe();
   }

   ngOnDestroy(): void {
       this._sBs.unsubscribe();
   }
}
