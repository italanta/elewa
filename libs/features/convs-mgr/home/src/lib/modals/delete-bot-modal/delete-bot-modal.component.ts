import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'convl-italanta-apps-delete-bot-modal',
  templateUrl: './delete-bot-modal.component.html',
  styleUrls: ['./delete-bot-modal.component.css'],
})
export class DeleteBotModalComponent implements OnInit {
  constructor(private _dialog:MatDialog) {}

  ngOnInit(): void {
    ''
  }
}
