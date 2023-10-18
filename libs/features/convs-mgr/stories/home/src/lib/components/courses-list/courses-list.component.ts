import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { Story } from '@app/model/convs-mgr/stories/main';

import { CreateLessonModalComponent } from '../../modals/create-lesson-modal/create-lesson-modal.component';

@Component({
  selector: 'italanta-apps-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent {
  @Input() courses$: Observable<
    {
      bot: Bot;
      modules$: Observable<
        {
          module: BotModule;
          stories$: Observable<Story[]>;
        }[]
      >;
    }[]
  >;
  
  constructor(private _dialog: MatDialog){}

  createLesson(moduleId: string) {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      botModId: moduleId
    };

    this._dialog.open(CreateLessonModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
  }
}
