import { orderBy as __orderBy } from 'lodash';

import { Component, Input, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, of, switchMap, tap } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';

import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';
import { CreateBotModalComponent, ActionSortingOptions, DeleteElementsEnum, ConfirmDeleteModalComponent } from '@app/elements/layout/convs-mgr/story-elements';
import { ConfirmArchiveModalComponent, ConfirmPublishModalComponent, MainChannelModalComponent } from '@app/features/convs-mgr/stories/bot-actions';

@Component({
  selector: 'italanta-apps-bots-list-all-courses',
  templateUrl: './bots-list-all-courses.component.html',
  styleUrls: ['./bots-list-all-courses.component.scss'],
})
export class BotsListAllCoursesComponent implements OnInit, AfterViewInit, OnDestroy 
{
  private _sbS = new SubSink();

  @Input() bots$: Observable<Bot[]>

  isPublishing: boolean;
  isUploading: boolean;

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  displayedColumns: string[] = ['name', 'type', 'lastEdited', 'channel', 'actions'];

  dataSource: MatTableDataSource<Bot> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortCoursesBy = 'newest';

  constructor(private _dialog: MatDialog,
              private _router$$: Router,
              private _snackBar: MatSnackBar,
              private _fileStorageService: FileStorageService) { }

  ngOnInit(): void 
  {
    this._sbS.sink 
      = combineLatest(([this.bots$, this.sorting$$.asObservable()]))
          .pipe(
            map(([bots, sort]) => 
              __orderBy(bots,(a) => __DateFromStorage(a.createdOn as Date).unix(),
              sort === ActionSortingOptions.Newest ? 'desc' : 'asc')),
            map((bots) =>
              bots.map((b) => ({ ...b, lastEdited: TIME_AGO(this.parseDate(b.updatedOn ? b.updatedOn : b.createdOn as Date)) }))),
          tap((bots) => 
            this.dataSource.data = bots.slice(0, 3)))
      .subscribe();

    this.configureFilter();
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

  configureFilter() {
    this.dataSource.filterPredicate = (data: Bot, filter: string) => {
      // Convert the filter to lowercase and remove extra spaces
      const filterText = filter.trim().toLowerCase(); 
    
      // Filtering using only specific columns
      return data.name.toLowerCase().includes(filterText);
    };
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

  openViewAllPage() {
    this._router$$.navigateByUrl('/bots/view-all')
  }

  connectToChannel(bot: Bot)
  {
    this._dialog.open(MainChannelModalComponent, {
      data: { bot }
    });
  }
  
  publishBot(bot:Bot){
    this.isPublishing = true;

    const dialogRef = this._dialog.open(ConfirmPublishModalComponent, {
      data: { bot }
    });

    const published$ = dialogRef.afterClosed();

    this._sbS.sink = published$.pipe(tap((published)=> {
      if (published) {
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

    this._sbS.unsubscribe();
  }

  archiveBot(bot: Bot) {
    this._dialog.open(ConfirmArchiveModalComponent, {
      data: { bot }
    });
  }

  deleteBot(bot:Bot) {
    this._dialog.open(ConfirmDeleteModalComponent, {
      data: { 
        mode: DeleteElementsEnum.BotModule, element: bot,
      }
    });
  } 

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}