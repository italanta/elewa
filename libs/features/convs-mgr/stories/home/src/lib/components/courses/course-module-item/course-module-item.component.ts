import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { BotMutationEnum } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';

import { DeleteElementsEnum } from '../../../model/delete-element.enum';
import { DeleteBotModalComponent } from '../../../modals/delete-bot-modal/delete-bot-modal.component';
import { CreateLessonModalComponent } from '../../../modals/create-lesson-modal/create-lesson-modal.component';

import { BotModulesStateService } from '@app/state/convs-mgr/modules';


@Component({
  selector: 'italanta-apps-course-module-item',
  templateUrl: './course-module-item.component.html',
  styleUrls: ['./course-module-item.component.scss'],
})
export class CourseModuleItemComponent {
  @Input() botModule: BotModule;
  @Input() story: Story;

  constructor(private _dialog: MatDialog, private _router$: Router, private _botsModulesServ$: BotModulesStateService,){}

  openModule(id: string) {
    this._router$.navigate(['modules', id]);
  }

  openLesson(id: string) {
    this._router$.navigate(['stories', id]);
  }

  editLesson(story: Story) {
    this._dialog.open(CreateLessonModalComponent, {
      minWidth: '600px', 
      data: {
        botMode: BotMutationEnum.EditMode, story: story
      }
    }).afterClosed();
  }

  deleteLesson(story: Story) {
    this._dialog.open(DeleteBotModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.Story, element: story, parentElement:this._botsModulesServ$.getBotModuleById(story.parentModule ?? "")
      }
    }).afterClosed();
  }
}
