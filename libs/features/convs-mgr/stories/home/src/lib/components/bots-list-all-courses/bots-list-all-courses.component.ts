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

import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';

import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';
import { CreateBotModalComponent } from '../../modals/create-bot-modal/create-bot-modal.component';
import { DeleteBotModalComponent } from '../../modals/delete-bot-modal/delete-bot-modal.component';

import { ActionSortingOptions } from '../../model/sorting.enum';
import { DeleteElementsEnum } from '../../model/delete-element.enum';

@Component({
  selector: 'italanta-apps-bots-list-all-courses',
  templateUrl: './bots-list-all-courses.component.html',
  styleUrls: ['./bots-list-all-courses.component.scss'],
})
export class BotsListAllCoursesComponent implements OnInit, AfterViewInit {

  private _sbS = new SubSink();

  @Input() bots$: Observable<Bot[]>
  @Input() showAllCourses: boolean;

  @Output() collapseAllCourses = new EventEmitter();

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  displayedColumns: string[] = ['name', 'type', 'lastEdited', 'channel', 'actions'];

  dataSource: MatTableDataSource<Bot> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortCoursesBy = 'newest';

  constructor(private _dialog: MatDialog,
              private _router$$: Router) { }

  ngOnInit(): void {
    this._sbS.sink = combineLatest(([this.bots$, this.sorting$$.asObservable()]))
    .pipe(map(([bots, sort]) => 
            __orderBy(bots,(a) => __DateFromStorage(a.createdOn as Date).unix(),
            sort === ActionSortingOptions.Newest ? 'desc' : 'asc')),
          map((bots) =>
            bots.map((b) => { 
              return { ...b, lastEdited: TIME_AGO(this.parseDate(b.updatedOn ? b.updatedOn : b.createdOn as Date)) }})),
          tap((bots) => this.dataSource.data = !this.showAllCourses ? bots.slice(0, 3) : bots)).subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openBot(id: string) {
    this._router$$.navigate(['bots', id]);
  }

  editBot(bot: Bot) {
    this._dialog.open(CreateBotModalComponent, {
      minWidth: '600px', 
      data: { 
        botMode: BotMutationEnum.EditMode, bot: bot
      }
    }).afterClosed();
  }

  deleteBot(bot: Bot) {
    this._dialog.open(DeleteBotModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.Bot, element: bot,
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