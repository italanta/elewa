import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { CreateLessonModalComponent } from '@app/features/convs-mgr/stories/home';


@Component({
  selector: 'app-stories-list-header',
  templateUrl: './stories-list-header.component.html',
  styleUrls: ['./stories-list-header.component.scss'],
})
export class StoriesListHeaderComponent {
  constructor(private _dialog: MatDialog) {}

  createBot() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      bot: '',
    };

    this._dialog.open(CreateLessonModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
  }
}
