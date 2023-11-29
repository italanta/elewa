import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Story } from '@app/model/convs-mgr/stories/main';

// TODO:@LemmyMwaura This imports should come from a shared module. - fix after AT
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  DeleteBotModalComponent, 
  DeleteElementsEnum, 
  CreateLessonModalComponent
} from '@app/features/convs-mgr/stories/home';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

@Component({
  selector: 'app-modules-lessons-list-view',
  templateUrl: './modules-lessons-list-view.component.html',
  styleUrls: ['./modules-lessons-list-view.component.scss'],
})
export class ModulesLessonsListViewComponent implements AfterViewInit {

  dataSource: MatTableDataSource<Story>

  @Input()
  set moduleLessonsData (value: MatTableDataSource<Story>) {
    this.dataSource = value
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'type', 'lastEdited', 'channel', 'actions'];

  sortCoursesBy = 'newest';

  constructor(private _dialog: MatDialog,
              private _router$$: Router) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openLesson(id: string) {
    this._router$$.navigate(['/stories', id]);
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
        mode: DeleteElementsEnum.Story, element: story, parentElement:story.parentModule
      }
    }).afterClosed();
  }

  parseDate(date: Date): number {
    if (date) {
      const v = date as unknown as any;
      const seconds = v.seconds;
      return seconds;
    }
    return 0;
  }
}
