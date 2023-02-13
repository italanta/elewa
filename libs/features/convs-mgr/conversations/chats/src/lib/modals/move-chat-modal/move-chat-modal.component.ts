import {Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import * as _ from 'lodash';

import { Logger, ToastService } from '@iote/bricks-angular';

import { Chat, ChatFlowStatus, ChatJumpPoint, ChatJumpPointMilestone } from '@elewa/model/conversations/chats';
import { BackendService } from '@ngfire/angular';
import { ChatJumpPointsStore } from '@elewa/state/conversations/chats';


@Component({
  selector: 'elewa-move-to-section-modal',
  styleUrls: ['move-chat-modal.component.scss'],
  templateUrl: 'move-chat-modal.component.html',
})
export class MoveChatModal
{
  isLoaded = false;
  chat: Chat;
  chapter: ChatJumpPoint;
  section: ChatJumpPointMilestone;
  sectionsList: string[];
  chapters: ChatJumpPoint[];
  data: ChatJumpPointMilestone[];
  
  constructor(
              private _backendService: BackendService,
              private _dialogRef: MatDialogRef<MoveChatModal>,
              private _toastService: ToastService,
              private _chatJumpPoints$: ChatJumpPointsStore,
              private _logger: Logger,
              @Inject(MAT_DIALOG_DATA) private _data: { chat: Chat })
  {
    this._chatJumpPoints$.get().subscribe(jumpPoints => this.convertToChapters(jumpPoints));
    this.chat = this._data.chat;
  }

  chatIsPaused()
  {
    return this.chat.flow === ChatFlowStatus.Paused || this.chat.flow === ChatFlowStatus.PausedByAgent;
  }

  convertToChapters(jumpPoints: any){
    this.chapters = jumpPoints[0];
  }

  refreshSections()
  {
    this.data = this.chapter.milestones;
    this.section = this.data[0];
  }

  moveChat()
  {
    const blockRef = (this.section as ChatJumpPointMilestone).blockId;
    const req = { chatId: this._data.chat.id, action: 'jump', blockReference: blockRef};
    this._backendService.callFunction('assignChat', req).subscribe();
    this.exitModal();
    this._toastService.doSimpleToast('Applying your changes..'); 
  }

  exitModal = () => this._dialogRef.close();

}