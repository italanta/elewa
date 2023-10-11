import { Component, Input, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Story } from '@app/model/convs-mgr/stories/main';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';

// TODO:@LemmyMwaura This imports should come from a shared module. - fix after AT
import {
  DeleteBotModalComponent, 
  ActionSortingOptions, 
  DeleteElementsEnum, 
  CreateLessonModalComponent
} from '@app/features/convs-mgr/stories/home';

@Component({
  selector: 'app-stories-list-all-courses',
  templateUrl: './stories-list-all-courses.component.html',
  styleUrls: ['./stories-list-all-courses.component.scss'],
})
export class StoriesListAllCoursesComponent implements OnInit, AfterViewInit {
 
  private _sbS = new SubSink();

  @Input() stories$: Observable<Story[]>
  @Input() showAllCourses: boolean;

  @Output() collapseAllCourses = new EventEmitter();

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  displayedColumns: string[] = ['name', 'type', 'lastEdited', 'channel', 'actions'];

  dataSource: MatTableDataSource<Story> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortCoursesBy = 'newest';

  constructor(private _dialog: MatDialog,
              private _router$$: Router) { }

  ngOnInit(): void {
    this._sbS.sink = combineLatest(([this.stories$, this.sorting$$.asObservable()]))
    .pipe(map(([stories, sort]) => 
            __orderBy(stories,(a) => __DateFromStorage(a.createdOn as Date).unix(),
            sort === ActionSortingOptions.Newest ? 'desc' : 'asc')),
          map((stories) =>
            stories.map((b) => { 
              return { ...b, lastEdited: TIME_AGO(this.parseDate(b.updatedOn ? b.updatedOn : b.createdOn as Date)) }})),
          tap((stories) => this.dataSource.data = !this.showAllCourses ? stories.slice(0, 3) : stories)).subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openBot(id: string) {
    this._router$$.navigate(['stories', id]);
  }

  editBot(story: Story) {
    this._dialog.open(CreateLessonModalComponent, {
      minWidth: '600px', 
      data: {
        botMode: BotMutationEnum.EditMode, story: story
      }
    }).afterClosed();
  }

  deleteBot(story: Story) {
    this._dialog.open(DeleteBotModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.Story, element: story
      }
    }).afterClosed();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortBy(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value as ActionSortingOptions;
    this.sortCoursesBy = searchValue;
    this.sorting$$.next(searchValue);
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
