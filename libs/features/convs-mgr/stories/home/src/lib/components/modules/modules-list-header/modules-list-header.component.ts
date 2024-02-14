import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { BreadcrumbService } from '@app/elements/layout/ital-bread-crumb';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';

import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';

import { ActionSortingOptions, CreateModuleModalComponent } from '@app/elements/layout/convs-mgr/story-elements';
import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { MainChannelModalComponent } from '../../../modals/main-channel-modal/main-channel-modal.component';

@Component({
  selector: 'italanta-apps-modules-list-header',
  templateUrl: './modules-list-header.component.html',
  styleUrls: ['./modules-list-header.component.scss'],
})
export class BotModulesListHeaderComponent implements OnInit, OnDestroy {
  @Input() parentBot$: Observable<Bot>;
  @Input() botModules$: Observable<BotModule[]>

  breadcrumbs$: Observable<iTalBreadcrumb[]>

  private _sBs = new SubSink();

  activeBotId:string;
  activeBot: Bot;

  isPublishing: boolean;

  dataSource = new MatTableDataSource<BotModule>();
  filteredBotModules: BotModule[];

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Default
  );

  sortCoursesBy = ActionSortingOptions.Default;

  dataFound = true;
  viewInListView = false;

  botModules: BotModule[];

  constructor(
    private _dialog: MatDialog, 
    private _route: ActivatedRoute,
    private _breadCrumbServ: BreadcrumbService,
    private _botsService$: BotsStateService,
  ) {
    this.activeBotId = this._route.snapshot.paramMap.get('id') as string;
    this.breadcrumbs$ = this._breadCrumbServ.breadcrumbs$;
  }

  ngOnInit(): void {
    this._sBs.sink = combineLatest(([this.botModules$, this.sorting$$.asObservable()]))
    .pipe(map(([botModules, sort]) => this.orderBotModules(botModules, sort)),
          map((botModules) =>
            botModules.map((b) => { 
              return { ...b, lastEdited: TIME_AGO(this.parseDate(b.updatedOn ? b.updatedOn : b.createdOn as Date)) }})),
          tap((botModules) => {
            this.dataSource.data = botModules
            this.filteredBotModules = botModules
          })).subscribe();

    this.configureFilter();

    // TODO: Refactor to pass the bot data through the router
    this._sBs.sink = this._botsService$.getBotById(this.activeBotId).subscribe((bot)=> {
      if(bot) {
        this.activeBot = bot
      }
    })
  }

  /** order BotModules */
  orderBotModules(botModules: BotModule[], sort?: string) {
    if (sort !== 'default') {
      return __orderBy(
          botModules,
          (a) => __DateFromStorage(a.createdOn as Date).unix(), 
          sort === ActionSortingOptions.Newest ? 'desc' : 'asc'
        )
    } else {
      return __orderBy(botModules, (a) => a.name)
    }
  }

  createModule() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      botId: this.activeBotId
    };

    this._dialog.open(CreateModuleModalComponent, {
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

  publishBot(bot: Bot){
    this.isPublishing = true;

    this._sBs.sink = this._botsService$.publishBot(bot)
                            .subscribe(() => this.isPublishing = false);
  }

  configureFilter() {
    this.dataSource.filterPredicate = (data: BotModule, filter: string) => {
      // Convert the filter to lowercase and remove extra spaces
      const filterText = filter.trim().toLowerCase(); 
    
      // Filtering using only specific columns
      return ((data.name).toLowerCase().includes(filterText) || 
              (data.description as string).toLowerCase().includes(filterText));
    };
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
    this.filteredBotModules = this.dataSource.filteredData;
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

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
