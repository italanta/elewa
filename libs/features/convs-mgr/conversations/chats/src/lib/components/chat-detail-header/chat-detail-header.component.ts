import { Timestamp } from '@firebase/firestore-types';

import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { from } from 'rxjs';

import { BackendService, UserService } from '@ngfi/angular';
import { ToastService } from '@iote/bricks-angular';
import { __FormatDateFromStorage } from '@iote/time';

import {Chat, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { iTalUser } from '@app/model/user';

import { MoveChatModal } from '../../modals/move-chat-modal/move-chat-modal.component';
import { StashChatModal } from '../../modals/stash-chat-modal/stash-chat-modal.component';
import { ConfirmActionModal } from '../../modals/confirm-action-modal/confirm-action-modal.component'
import { ViewDetailsModal } from '../../modals/view-details-modal/view-details-modal.component';

@Component({
  selector: 'app-chat-detail-header',
  templateUrl: './chat-detail-header.component.html',
  styleUrls:  ['./chat-detail-header.component.scss'],
})
export class ChatDetailHeaderComponent implements OnChanges
{
  @Input() chat: Chat;

  loading = true;
  confirmDialogRef: MatDialogRef<ConfirmActionModal>;
  moveChatDialogRef: MatDialogRef<MoveChatModal>;
  agentPaused: boolean = true;

  user: iTalUser;

  constructor(private userService: UserService<iTalUser>,
              private _backendService: BackendService,
              private _router: Router,
              private _toastService: ToastService,
              private _dialog: MatDialog)
  {
    this.userService.getUser().subscribe(user => this.user = user);
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['chat'])
    {
      this.agentPaused = this.chat.status === ChatStatus.Paused;
      this.loading = false;
      if(this.confirmDialogRef)
      {
        this.confirmDialogRef.close();
        this.confirmDialogRef = null as any;
      }
      else if(this.moveChatDialogRef)
      {
        this.moveChatDialogRef.close();
        this.moveChatDialogRef = null as any;
      }
    }
  }

  formatDate = (date: Timestamp | Date) => __FormatDateFromStorage(date);

  testPayment = () => this._backendService.callFunction('purchase', { id: this.chat.id, course: 'ITC' });

  getClass()
  {
    switch(this.chat.status)
    {
      case ChatStatus.Running:
        return 'active';
      case ChatStatus.Ended:
        return 'complete';
      case ChatStatus.Disabled:
      case ChatStatus.Stashed:
        return '';
      default:
        return 'paused';
    }
  }

  checkStatus()
  {
    return this.chat.status === ChatStatus.Running;
  }

  getStatus(flowCode: string)
  {
    switch(flowCode){
      case ChatStatus.Paused:
        return "Requested for Assistance";
      case ChatStatus.PausedByAgent:
        return "Paused by Trainer";
      case ChatStatus.Ended:
        return "Completed";
      // case ChatStatus.PendingAssessment:
      //   return "Pending Assessment";
      // case ChatStatus.OnWaitlist:
      //   return "Requested for Assistance";
      case ChatStatus.Stashed:
        return "Stashed";
      default:
        return "Flowing";
    }
  }

  chatIsPaused()
  {
    return this.chat.status === ChatStatus.PausedByAgent;
  }

  hasCompleted()
  {
    return this.chat.status === ChatStatus.Ended && this.chat.awaitingResponse;
  }

  isInactive()
  {
    return this.chat.status === ChatStatus.Stashed || this.chat.status === ChatStatus.Disabled;
  }

  viewDetails()
  {
    this._dialog.open(ViewDetailsModal, {
      data: { chat: this.chat, isAdmin: this.user.roles.admin },
      width: '500px'
    });
  }

  openModal(type: 'resume' | 'move' | 'stash')
  {
    if (this.loading || (!this.chatIsPaused() && !this.hasCompleted()))
    {
      this._toastService.doSimpleToast('Error! Action requires chat to be paused!')
      return;
    }
    switch(type)
    {
      case 'resume':
        this.resumeChat();
        break;
      case 'move':
        this.moveChat();
        break;
      case 'stash':
        this.stashChat();
        break;
    }
  }

  pauseChat()
  {
    const agentId = this.user.id;
    const req = { chatId: this.chat.id, agentId: agentId};

    this.confirmDialogRef = this._dialog.open(ConfirmActionModal, {
      data: { req: req, action: 'talkToHuman' },
      width: '500px'
    })
    this.confirmDialogRef.afterClosed().subscribe(() => this.loading = false);
  }

  resumeChat()
  {
    if(this.chat.status === ChatStatus.Paused)
    {
      this.moveChat();
    }
    else{
      this.loading = true;

      const req = { chatId: this.chat.id, action: 'resume' };

      this.confirmDialogRef = this._dialog.open(ConfirmActionModal, {
                                      data: { req: req, action: 'assignChat' },
                                      width: '500px'
                                    })
      this.confirmDialogRef.afterClosed().subscribe(() => this.loading = false);
    }
  }

  moveChat()
  {
    this.moveChatDialogRef = this._dialog.open(MoveChatModal, {
      data: { chat: this.chat },
      width: '500px'
    })
  }

  stashChat()
  {
    this._dialog.open(StashChatModal, {
      data: { chat: this.chat },
      width: '500px'
    })
  }

  // cancelReq()
  // {
  //   const req = { chatId: this.chat.id };
  //   this._backendService.callFunction('cancelHelpRequest', req);
  // }

  completeCourse()
  {
    const req = { chatId: this.chat.id,  course: "ITC" };

    const callBackendService = from(this._backendService.callFunction('endCourse', req));

    callBackendService.subscribe();
  }

  goBack()
  {
    this._router.navigate(['/chats']);
  }
}
