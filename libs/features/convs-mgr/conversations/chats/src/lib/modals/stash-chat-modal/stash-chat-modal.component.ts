import {Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { from } from 'rxjs';
import { SubSink } from 'subsink';

import { Logger, ToastService } from '@iote/bricks-angular';
import { User } from '@iote/bricks';

import { UserService, BackendService } from '@ngfi/angular';

import { Chat } from '@app/model/convs-mgr/conversations/chats';
import { iTalUser } from '@app/model/user';


@Component({
  selector: 'elewa-move-to-section-modal',
  styleUrls: ['stash-chat-modal.component.scss'],
  templateUrl: 'stash-chat-modal.component.html',
})

export class StashChatModal implements OnInit, OnDestroy
{
  private _sbs = new SubSink();

  stashReasonForm: FormGroup;
  isLoaded = false;
  user: User;
  chat: Chat;
  reason: string;

  reasons = [
    'User has already completed ITC. ',
    'User has already completed PTC. ',
    'User already completed the Basic Wood Badge courses (ITC & PTC) ',
    'User was just testing the platform',
    'User was only making an enquiry',
  ];

  
  constructor(private _fb: FormBuilder,
              private userService: UserService<iTalUser>,
              private _backendService: BackendService,
              private _dialogRef: MatDialogRef<StashChatModal>,
              private _toastService: ToastService,
              private _logger: Logger,
              @Inject(MAT_DIALOG_DATA) private _data: { chat: Chat })
  {
    this._sbs.sink = this.userService.getUser().subscribe(user => this.user = user);
    this.chat = this._data.chat;
  }

  ngOnInit()
  {
    this.stashReasonForm = this._fb.group({
      reason:      ['', [Validators.required]],
    })
  }

  stash()
  {
    
    if(this.stashReasonForm.valid || !this.reasonNeedsDetails()) 
    {
      const agentId = this.user.id;
      const req = { chatId: this._data.chat.id, action: 'stash', agentId: agentId, stashReason: this.reason};
      this._sbs.sink = from(this._backendService.callFunction('assignChat', req)).subscribe();
      this.actionComplete();
    }    
  }

  reasonNeedsDetails()
  {
    return this.reason === this.reasons[4];
  }

  reasonIsMissing()
  {
    return this.reasonNeedsDetails() && this.stashReasonForm.invalid;
  }

  actionComplete()
  {
    this.exitModal();
    this._toastService.doSimpleToast(`Chat ${this.chat.name} has successfully been stashed.`); 
  }

  exitModal = () => this._dialogRef.close();

  ngOnDestroy() {
    this._sbs.unsubscribe()
  }
}