import {Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { __NewDate, __DateFromStorage } from '@iote/time';

import { ChatMessage, MessageOrigins, TextMessage }   from '@elewa/model/conversations/messages';

@Component({
  selector: 'elewa-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls:  ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit
{
  @Input() message: ChatMessage;

  // Calculated properties
  messageIsNotMine: boolean;
  agentMessage: boolean;
  timestamp: string;

  constructor(private _sanetizer: DomSanitizer) {}

  ngOnInit()
  {
    this.messageIsNotMine = this.message.origin === MessageOrigins.User;

    this.agentMessage = this.message.origin === MessageOrigins.Operator;

    this.timestamp = __DateFromStorage(this.message.date).format('DD/MM HH:mm');
  }

  textMessage(message: ChatMessage)
  {
    const html = this._convertText((message as TextMessage).message);
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
