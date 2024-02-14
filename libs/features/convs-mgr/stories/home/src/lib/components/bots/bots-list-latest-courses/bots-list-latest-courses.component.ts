import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Observable, map, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';

import { BotsStateService } from '@app/state/convs-mgr/bots';


import { MainChannelModalComponent } from '../../../modals/main-channel-modal/main-channel-modal.component';

@Component({
  selector: 'italanta-apps-bots-list-latest-courses',
  templateUrl: './bots-list-latest-courses.component.html',
  styleUrls: ['./bots-list-latest-courses.component.scss'],
})
export class BotsListLatestCoursesComponent implements OnInit {

  @Input() bots$: Observable<Bot[]>;

  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`

  bots: Bot[];

  screenWidth: number;

  isPublishing :boolean;

  constructor(private _router$$: Router, private _dialog: MatDialog, private _botsService : BotsStateService ) {}

  ngOnInit(): void {

    this.screenWidth = window.innerWidth;

    if (this.bots$) {
      this.bots$.pipe(
        map((s) => __orderBy(s,(a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
    }
  }

  connectToChannel(botId: string) {
    this._dialog.open( MainChannelModalComponent,{
      width: '30rem',
      height:'27rem',
      data:{botId:botId}
    })
   }
  deleteBot(botId:Bot){
    this._botsService.deleteBot(botId)
  } 

  archiveBot(bot:Bot){
    bot.isArchived = true;
    this._botsService.updateBot(bot)
  }
  publishBot(bot:Bot){
    bot.isPublishing = true;
    bot.isPublished = true;
    this._botsService.updateBot(bot)
      .subscribe(() => {
        bot.isPublishing = false;
      });
   }
   
   

  openBot(id: string) {
    this._router$$.navigate(['bots', id]);
  }
}
