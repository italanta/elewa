import {Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import * as _ from 'lodash';

import { Logger, ToastService } from '@iote/bricks-angular';

import { Chat, ChatFlowStatus, ChatJumpPoint, ChatJumpPointMilestone } from '@elewa/model/conversations/chats';
import { BackendService } from '@ngfire/angular';
import { ChatJumpPointsStore } from '@elewa/state/conversations/chats';


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
              private _backendService: BackendService,
              private _dialogRef: MatDialogRef<ViewDetailsModal>,
              private _toastService: ToastService,
              private _logger: Logger,
              @Inject(MAT_DIALOG_DATA) private _data: { chat: Chat, isAdmin: boolean})
  {
    this.chat = this._data.chat;
    this.isAdmin = this._data.isAdmin;
  }

  update()
  {

  }

  exitModal = () => this._dialogRef.close();

}