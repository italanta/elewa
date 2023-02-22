import * as _ from 'lodash';

import {Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Logger, ToastService } from '@iote/bricks-angular';
import { BackendService } from '@ngfi/angular';

import { Chat, ChatJumpPoint, ChatJumpPointMilestone, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';
import { ChatJumpPointsStore } from '@app/state/convs-mgr/conversations/chats';
import { from } from 'rxjs';

@Component({
  selector: 'app-move-to-section-modal',
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
    from(this._backendService.callFunction('assignChat', req)).subscribe();
    this.exitModal();
    this._toastService.doSimpleToast('Applying your changes..'); 
  }

  exitModal = () => this._dialogRef.close();

}