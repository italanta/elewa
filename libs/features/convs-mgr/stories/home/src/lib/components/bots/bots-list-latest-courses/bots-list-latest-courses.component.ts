import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Observable, map, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';


import { ConnectToChannelModalComponent } from '../../../modals/connect-to-channel-modal/connect-to-channel-modal.component';

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

  constructor(private _router$$: Router, private _dialog: MatDialog, ) {}

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
   
   

  openBot(id: string) {
    this._router$$.navigate(['bots', id]);
  }
}
