import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Observable, map, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';


import { ConnectToChannelModalComponent } from '../../../modals/connect-to-channel-modal/connect-to-channel-modal.component';
import { BotsModuleService } from '../../../services/bots-module.service';

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

  constructor(private _router$$: Router, private _dialog: MatDialog, private _botsModuleService$:BotsModuleService ) {}

  ngOnInit(): void {

    this.screenWidth = window.innerWidth;

    if (this.bots$) {
      this.bots$.pipe(
        map((s) => __orderBy(s,(a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
    }
  }

  connectToChannel(botId:string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30rem'; // Set the width of the dialog
    dialogConfig.height = '20rem'; // Set the height of the dialog
    dialogConfig.data = { botId: botId }; // Pass the botId to the dialog
    this._dialog.open(ConnectToChannelModalComponent, dialogConfig);
  }
  deleteBot(botId:Bot){
    this._botsModuleService$.deleteBot(botId)
  } 

  archiveBot(bot:Bot){
    bot.archived = true;
    this._botsModuleService$.archiveBot(bot)
  }
  publishBot(bot:Bot){
    this.isPublishing = true;
    bot.isPublished = true;
    this._botsModuleService$.publishBot(bot)
      .subscribe(() => {
        this.isPublishing = false;
      });
  }
   

  openBot(id: string) {
    this._router$$.navigate(['bots', id]);
  }
}
