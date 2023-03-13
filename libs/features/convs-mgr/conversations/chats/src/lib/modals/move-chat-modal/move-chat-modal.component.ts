import * as _ from 'lodash';

import {Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, take } from 'rxjs';
import { Logger, ToastService } from '@iote/bricks-angular';
import { BackendService } from '@ngfi/angular';

import { Chat, ChatJumpPoint, ChatJumpPointMilestone, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';
import { ChatJumpPointsStore, ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { Story } from '@app/model/convs-mgr/stories/main';
import { StoriesStore } from '@app/state/convs-mgr/stories';

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
  selectedStory: Story;
  stories$: Observable<Story[]>;
  sectionsList: string[];
  chapters: ChatJumpPoint[];
  data: ChatJumpPointMilestone[];
  
  constructor(
              private _backendService: BackendService,
              private _dialogRef: MatDialogRef<MoveChatModal>,
              private _toastService: ToastService,
              private _chatJumpPoints$: ChatJumpPointsStore,
              private _afsF: AngularFireFunctions,
              private _chats$: ChatsStore,
              private _logger: Logger,
              private _stories$$: StoriesStore,
              @Inject(MAT_DIALOG_DATA) private _data: { chat: Chat })
  {
    this.stories$ = this._stories$$.get()
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
    const req = { storyId: this.selectedStory.id, orgId: this.selectedStory.orgId, endUserId: this._data.chat.id,};
    this._afsF.httpsCallable('moveChat')(req).subscribe();
    this._chats$.pauseChat(this._data.chat.id).pipe(take(1)).subscribe()
    this.exitModal();
  }

  exitModal = () => this._dialogRef.close();
}