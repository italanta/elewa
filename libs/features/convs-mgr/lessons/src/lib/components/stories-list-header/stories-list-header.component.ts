import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Story } from '@app/model/convs-mgr/stories/main';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';

import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ActionSortingOptions, CreateLessonModalComponent } from '@app/features/convs-mgr/stories/home';
import { BotModule } from '@app/model/convs-mgr/bot-modules';

@Component({
  selector: 'app-stories-list-header',
  templateUrl: './stories-list-header.component.html',
  styleUrls: ['./stories-list-header.component.scss'],
})
export class StoriesListHeaderComponent implements OnInit {
  activeBotModId:string;

  constructor(private _dialog: MatDialog, private _route: ActivatedRoute) {
    this.activeBotModId = this._route.snapshot.paramMap.get('id') as string;
  }

  @Input() parentBotModule$: Observable<BotModule>;
  @Input() stories$: Observable<Story[]>

  private _sBs = new SubSink();

  activeBotId:string;

  dataSource = new MatTableDataSource<Story>();

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  sortCoursesBy = 'newest';

  dataFound = true;

  viewInListView = false;

  ngOnInit(): void {
    this._sBs.sink = combineLatest(([this.stories$, this.sorting$$.asObservable()]))
    .pipe(map(([stories, sort]) => 
            __orderBy(stories,(a) => __DateFromStorage(a.createdOn as Date).unix(),
            sort === ActionSortingOptions.Newest ? 'desc' : 'asc')),
          map((stories) =>
            stories.map((b) => { 
              return { ...b, lastEdited: TIME_AGO(this.parseDate(b.updatedOn ? b.updatedOn : b.createdOn as Date)) }})),
          tap((stories) => this.dataSource.data = stories)).subscribe();

    this.configureFilter();
  }

  createBot() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      botModId: this.activeBotModId 
    };

    this._dialog.open(CreateLessonModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
  }

  configureFilter() {
    this.dataSource.filterPredicate = (data: Story, filter: string) => {
      // Convert the filter to lowercase and remove extra spaces
      const filterText = filter.trim().toLowerCase(); 
    
      // Filtering using only specific columns
      return ((data.name as string).toLowerCase().includes(filterText) || 
              (data.description as string).toLowerCase().includes(filterText));
    };
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
    this.dataFound = (this.dataSource.filteredData.length > 0);
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
