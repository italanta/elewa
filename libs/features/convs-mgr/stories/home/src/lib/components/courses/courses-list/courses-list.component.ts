import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';

import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { CreateLessonModalComponent } from '../../../modals/create-lesson-modal/create-lesson-modal.component';
import { Course } from '../../../model/courses.interface';

@Component({
  selector: 'italanta-apps-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent {
  @Input() courses$: Observable<Course>;
  @Input()
  set searchValue(value: string) {
    this.filterString$ = of(value);
  }

  filterString$: Observable<string>;

  constructor(private _dialog: MatDialog) {}

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
}
