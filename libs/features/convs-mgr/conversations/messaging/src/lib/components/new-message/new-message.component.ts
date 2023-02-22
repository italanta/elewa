import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

import { from } from 'rxjs';

import { User } from '@iote/bricks';
import { UserService, BackendService } from '@ngfi/angular';

import { Chat, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';
import { iTalUser } from '@app/model/user';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls:  ['new-message.component.scss'],
})
export class NewMessageComponent implements OnChanges
{
  disabled: boolean;
  @Input() chat: Chat;
  @Input() status: ChatFlowStatus | undefined;
  
  message = '';
  user: User;

  @Output()
  newMessage = new EventEmitter<string>();

  constructor(private userService: UserService<iTalUser>,
              private _backendService: BackendService) 
  {
    userService.getUser().subscribe(user => this.user = user);
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['status']){
      this.refreshElements();
    }
  }

  refreshElements() 
  {
    this.disabled = !this.isPaused() && !this.hasCompleted();
  }

  isPaused()
  {
    return this.status === ChatFlowStatus.Paused || this.status === ChatFlowStatus.PausedByAgent;
  }

  hasCompleted()
  {
    return this.status === ChatFlowStatus.Completed && this.chat.awaitingResponse;
  }

  onInputKeyup({ keyCode }: KeyboardEvent) {
    if (keyCode === 13) {
      this.emitMessage();
    }
  }

  emitMessage() {
    if (this.message && !this.disabled) 
    {
      const data = { chatId: this.chat.id, message: this.message, agentId: this.user.id };
      from(this._backendService.callFunction('sendMessage', data)).subscribe();
      this.newMessage.emit(this.message);
      this.message = '';
    }
  }
}
