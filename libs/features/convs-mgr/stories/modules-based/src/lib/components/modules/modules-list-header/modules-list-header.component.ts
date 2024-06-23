import { orderBy as __orderBy } from 'lodash';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { __DateFromStorage } from '@iote/time';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';

import { BotsStateService } from '@app/state/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';
import { FallbackService } from '@app/state/convs-mgr/fallback';

import { BreadcrumbService } from '@app/elements/layout/ital-bread-crumb';
import { ActionSortingOptions, CreateModuleModalComponent } from '@app/elements/layout/convs-mgr/story-elements';

import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';
import { ConfirmPublishModalComponent, MainChannelModalComponent } from '@app/features/convs-mgr/stories/bot-actions';

@Component({
  selector: 'italanta-apps-modules-list-header',
  templateUrl: './modules-list-header.component.html',
  styleUrls: ['./modules-list-header.component.scss'],
})
export class BotModulesListHeaderComponent implements OnInit, OnDestroy 
{
  @Input() parentBot$: Observable<Bot>;
  @Input() botModules$: Observable<BotModule[]>

  breadcrumbs$: Observable<iTalBreadcrumb[]>

  private _sBs = new SubSink();

  activeBotId:string;
  activeBot: Bot;

  isPublishing: boolean;
  isUploading: boolean;

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
    private _router$: Router,
    private _route: ActivatedRoute,
    private _breadCrumbServ: BreadcrumbService,
    private _fallbackService: FallbackService,
    private _botsService$: BotsStateService,
    private _snackBar: MatSnackBar,
    private _fileStorageService: FileStorageService
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
            this.dataFound = botModules.length > 0;
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

  connectToChannel(bot: Bot)
  {
    this._dialog.open(MainChannelModalComponent, {
      data: { bot }
    });
  }

  goToFallBacks(bot: Bot) {
    this._fallbackService.setBot(bot);

    this._router$.navigate(['/ai-fallbacks', bot.id])
  }
  
  publishBot(bot:Bot){
    this.isPublishing = true;

    const dialogRef = this._dialog.open(ConfirmPublishModalComponent, {
      data: { bot }
    });

    const published$ = dialogRef.afterClosed();

    this._sBs.sink = published$.pipe(tap((published)=> {
      if(published) {
        this.isPublishing = false;
      }
    }), 
      switchMap(() => {
        if(bot.linkedChannel) {
          this.isUploading = true;
          return this._fileStorageService.uploadMediaToPlatform(bot);
        } else {
          return of(null);
        }
      })).subscribe((result)=> {
          this.isUploading = false;
          if(result.success) {
            this.openSnackBar('Media upload successful', 'OK');
          } else {
            // Show failure due to linked channel
            this.openSnackBar('Media upload failed. Confirm channel details', 'OK');
          }
        })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
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
