import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog  } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { 
  DeleteElementsEnum,
  DeleteBotModalComponent,
  CreateLessonModalComponent
} from '@app/elements/layout/convs-mgr/story-elements';

@Component({
  selector: 'italanta-apps-course-module-item',
  templateUrl: './course-module-item.component.html',
  styleUrls: ['./course-module-item.component.scss'],
})
export class CourseModuleItemComponent {
  @Input() botModule: BotModule;
  @Input() story: Story;

  _sBs = new SubSink();

  constructor(private _dialog: MatDialog, 
              private _router$: Router) {}

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
    this._dialog.open(DeleteBotModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.Story, element: story, parentElement:story.parentModule
      }
    }).afterClosed();
  }

}
