import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import { Chat, ChatFlowStatus } from '@elewa/model/conversations/chats';
import { EleUser } from '@elewa/model/user';
import { User } from '@iote/bricks';
import { BackendService, UserService } from '@ngfire/angular';

@Component({
  selector: 'elewa-new-message',
  templateUrl: './new-message.component.html',
  styleUrls:  ['new-message.component.scss'],
})
export class NewMessageComponent implements OnChanges
{
  disabled: boolean;
  @Input() chat: Chat;
  @Input() status: ChatFlowStatus;
  
  message = '';
  user: User;

  @Output()
  newMessage = new EventEmitter<string>();

  constructor(private userService: UserService<EleUser>,
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
      this._backendService.callFunction('sendMessage', data).subscribe();
      this.newMessage.emit(this.message);
      this.message = '';
    }
  }
}
