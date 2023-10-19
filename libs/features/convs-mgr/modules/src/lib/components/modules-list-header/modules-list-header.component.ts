import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';

import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ActionSortingOptions, CreateModuleModalComponent } from '@app/features/convs-mgr/stories/home';

@Component({
  selector: 'app-modules-list-header',
  templateUrl: './modules-list-header.component.html',
  styleUrls: ['./modules-list-header.component.scss'],
})
export class ModulesListHeaderComponent implements OnInit {
  @Input() parentBot$: Observable<Bot>;
  @Input() botModules$: Observable<BotModule[]>

  private _sBs = new SubSink();

  activeBotId:string;

  dataSource = new MatTableDataSource<BotModule>();

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  sortCoursesBy = 'newest';

  dataFound = true;
  viewInListView = false;

  botModules: BotModule[];

  constructor(private _dialog: MatDialog, private _route: ActivatedRoute) {
    this.activeBotId = this._route.snapshot.paramMap.get('id') as string;
  }

  ngOnInit(): void {
    this._sBs.sink = combineLatest(([this.botModules$, this.sorting$$.asObservable()]))
    .pipe(map(([botModules, sort]) => 
            __orderBy(botModules,(a) => __DateFromStorage(a.createdOn as Date).unix(),
            sort === ActionSortingOptions.Newest ? 'desc' : 'asc')),
          map((botModules) =>
            botModules.map((b) => { 
              return { ...b, lastEdited: TIME_AGO(this.parseDate(b.updatedOn ? b.updatedOn : b.createdOn as Date)) }})),
          tap((botModules) => this.dataSource.data = botModules)).subscribe();
  }

  createBot() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      botId: this.activeBotId
    };

    this._dialog.open(CreateModuleModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
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
