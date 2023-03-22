import {Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Message, MessageDirection, TextMessage } from '@app/model/convs-mgr/conversations/messages';

import { __NewDate, __DateFromStorage } from '@iote/time';

// import { ChatMessage, MessageOrigins, TextMessage }   from '@elewa/model/conversations/messages';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls:  ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit
{
  @Input() message: Message;

  // Calculated properties
  messageIsNotMine: boolean;
  agentMessage: boolean;
  timestamp: string;

  constructor(private _sanetizer: DomSanitizer) {}

  ngOnInit()
  {
    this.messageIsNotMine = this.message.direction === MessageDirection.FROM_END_USER;

    this.agentMessage = this.message.direction === MessageDirection.TO_END_USER;

    this.timestamp = __DateFromStorage(this.message.createdOn as Date).format('DD/MM HH:mm');
  }

  textMessage(message: Message)
  {
    const html = this._convertText((message as TextMessage).text);
    return this._sanetizer.bypassSecurityTrustHtml(html);
  }

  private _convertText(message: string)
  {
    if(message) {
      message = this._replaceTags(message, '*', '<b>', '</b>');
      message = this._replaceTags(message, '_', '<i>', '</i>');
    }
    return message;
  }

  // Replaces md with html e.g. *text* => <b>text</b>
  private _replaceTags(message: string, tagEl: string, openTag: string, closeTag: string)
  {
    let inTag = false;
    while(message.indexOf(tagEl) >= 0)
    {
      message = this._replaceAt(message, message.indexOf(tagEl), inTag ? closeTag : openTag);
      inTag = !inTag;
    }

    return message;
  }

  private _replaceAt(msg : string, index : number, replacement: string) {
    return msg.substr(0, index) + replacement + msg.substr(index + 1);
  }
}
