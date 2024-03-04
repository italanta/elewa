import { orderBy as __orderBy } from 'lodash';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { Observable, map, tap } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';

import { MainChannelModalComponent } from '../../../modals/main-channel-modal/main-channel-modal.component';

@Component({
  selector: 'italanta-apps-bots-list-latest-courses',
  templateUrl: './bots-list-latest-courses.component.html',
  styleUrls: ['./bots-list-latest-courses.component.scss'],
})
export class BotsListLatestCoursesComponent implements OnInit, OnDestroy
{

  @Input() bots$: Observable<Bot[]>;

  private _sBs = new SubSink();

  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`;

  bots: Bot[];

  uploadMedia: boolean;

  screenWidth: number;

  isPublishing: boolean;

  constructor(
    private _router$$: Router, 
    private _dialog: MatDialog, 
    private _botsService: BotsStateService,
    private _fileStorageService: FileStorageService
    ) { }

  ngOnInit(): void
  {

    this.screenWidth = window.innerWidth;

    if (this.bots$) {
      this._sBs.sink = this.bots$.pipe(
        map((s) => __orderBy(s, (a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
    }
  }

  connectToChannel(botId: string)
  {
    this._dialog.open(MainChannelModalComponent, {
      data: { botId: botId }
    });
  }
  
  publishBot(bot:Bot){
    this.isPublishing = true;
    bot.isPublished = true;
    this._sBs.sink = this._botsService.updateBot(bot)
      .subscribe(() => {
        this.isPublishing = false;
      });

    // Upload Media to platform server e.g. whatsapp server
    //  Solves delays in sending images vs text  
    if(this.uploadMedia && bot.linkedChannel) {
      this._fileStorageService.uploadMediaToPlatform(bot.linkedChannel).subscribe()
    }
  }

  archiveBot(bot: Bot) 
  {
    this._sBs.sink = this._botsService.archiveBot(bot).subscribe();
  }

  openBot(id: string)
  {
    this._router$$.navigate(['bots', id]);
  }

  deleteBot(botId:Bot){
    this._botsService.deleteBot(botId)
  } 

  ngOnDestroy(): void
  {
    this._sBs.unsubscribe();
  }
}
