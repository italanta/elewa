import {Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Chat } from '@app/model/convs-mgr/conversations/chats';

@Component({
  selector: 'elewa-move-to-section-modal',
  styleUrls: ['view-details-modal.component.scss'],
  templateUrl: 'view-details-modal.component.html',
})
export class ViewDetailsModal
{
  isLoaded = false;
  isAdmin = false;
  chat: Chat;
  
  constructor(
              private _dialogRef: MatDialogRef<ViewDetailsModal>,
              @Inject(MAT_DIALOG_DATA) private _data: { chat: Chat, isAdmin: boolean})
  {
    this.chat = this._data.chat;
    this.isAdmin = this._data.isAdmin;
  }

  update() {
    
  }
  exitModal = () => this._dialogRef.close();

}