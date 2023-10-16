import { Component, Input, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { SubSink } from 'subsink';
import { User } from '@iote/bricks';
import { UserService, BackendService } from '@ngfi/angular';
import { iTalUser } from '@app/model/user';
import { MessageTypes } from '@app/model/convs-mgr/functions';
import { Chat, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { MessageDirection, TextMessage } from '@app/model/convs-mgr/conversations/messages';
import { MessagesQuery } from '@app/state/convs-mgr/conversations/messages';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['new-message.component.scss'],
})
export class NewMessageComponent implements OnChanges {
  private _sbs = new SubSink();

  @Input() chat: Chat;
  @Input() status: ChatStatus | undefined;

  message = '';
  user: User;

  @Output() newMessage = new EventEmitter<string>();

  constructor(
    private userService: UserService<iTalUser>,
    private _backendService: BackendService,
    private _msgQuery: MessagesQuery,
  ) {
    this._sbs.sink = userService.getUser().subscribe((user) => (this.user = user));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['status']) {
      this.refreshElements();
    }
  }

  refreshElements() {
    // Handle any necessary changes here
  }

  onInputKeyup({ keyCode }: KeyboardEvent) {
    if (keyCode === 13) {
      this.emitMessage();
    }
  }

  emitMessage() {
    if (this.message) {
      const data = { chatId: this.chat.id, message: this.message, agentId: this.user.id };

      const n = parseInt(this.chat.id.split('_')[1]);

      const textMessage: TextMessage = {
        text: this.message,
        type: MessageTypes.TEXT,
        direction: MessageDirection.FROM_AGENT_TO_END_USER,
        endUserPhoneNumber: this.chat.phoneNumber,
        n,
      };

      // Example: Call the backend service and add the message to the query
      // from(this._backendService.callFunction('sendOutgoingMessage', textMessage)).subscribe();
      this._sbs.sink = this._msgQuery.addMessage(textMessage).subscribe();

      // Emit the message
      this.newMessage.emit(this.message);

      // Clear the message input
      this.message = '';
    }
  }
}


