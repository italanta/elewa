import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBotModalComponent } from '../../modals/create-bot-modal/create-bot-modal.component';

@Component({
  selector: 'italanta-apps-bots-list-header',
  templateUrl: './bots-list-header.component.html',
  styleUrls: ['./bots-list-header.component.scss'],
})
export class BotsListHeaderComponent implements OnInit {

  constructor(private _dialog: MatDialog) {}

  ngOnInit(): void {}

  createBot() {
    const dialogData = {
      isEditMode: false,
      story: ''
    }

    this._dialog.open(CreateBotModalComponent, {minWidth: '600px', data: dialogData}).afterClosed();
  }
}
