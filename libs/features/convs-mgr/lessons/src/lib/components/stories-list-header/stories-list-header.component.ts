import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { CreateLessonModalComponent } from '@app/features/convs-mgr/stories/home';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-stories-list-header',
  templateUrl: './stories-list-header.component.html',
  styleUrls: ['./stories-list-header.component.scss'],
})
export class StoriesListHeaderComponent {
  activeBotModId:string;

  constructor(private _dialog: MatDialog, private _route: ActivatedRoute) {
    this.activeBotModId = this._route.snapshot.paramMap.get('id') as string;
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
}
