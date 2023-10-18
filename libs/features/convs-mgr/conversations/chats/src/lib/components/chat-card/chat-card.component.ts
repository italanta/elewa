import { Component, Input, SimpleChanges, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';

import { SubSink } from 'subsink';

import { tap } from 'rxjs';
import { __DateFromStorage } from '@iote/time';

import { ChatFlowStatus, Chat } from '@app/model/convs-mgr/conversations/chats';
import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { MessagesQuery } from '@app/state/convs-mgr/conversations/messages';
import { MessageTypes } from '@app/model/convs-mgr/functions';

import { TIME_AGO } from '../../providers/duration-from-date';
import { GET_RANDOM_COLOR, GET_USER_AVATAR } from '../../providers/avatar.provider';


@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls:  ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnChanges, OnDestroy, AfterViewInit
{
  private _sbs = new SubSink()
  @Input() chat: Chat;
  @Input() currentChat: Chat;

  lastMessageDate: string;
  lastMessageType: string;
  MessageTypes:MessageTypes;
  imageSource: string; 

  lastMessage:string;

  constructor(private _chats$: ChatsStore, private _msgsQuery$: MessagesQuery)
  {}

  ngAfterViewInit(): void {
    if (this.chat) {
      this.getChatName();
      this.getLastChat();
    }

  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['currentChat'])
    {
      this.currentChat = changes['currentChat'].currentValue;
    }
  }

  getChatName() {
    const variableValues = this._chats$.getChatUserName(this.chat.id);

    if(variableValues) {
      this._sbs.sink = variableValues.subscribe((values)=> this.chat.name = values.name);
    }
  }

  setLastMessageDate() {
    this._sbs.sink = this._msgsQuery$.getLatestMessageDate(this.chat.id).subscribe((date) => { 
      const newDate = __DateFromStorage(date as Date);
      this.lastMessageDate = newDate.format('DD/MM/YYYY HH:mm');
    });
  }

  getLastChat() {
    this._sbs.sink = this._msgsQuery$.getLatestMessage(this.chat.id).pipe(
      tap(latestMessage => {
          switch (latestMessage.type) {
            case MessageTypes.TEXT: 
              this.lastMessage = latestMessage.text;
              break;
            case MessageTypes.QUESTION:
              this.lastMessage = latestMessage.options[0].optionText;
              break;
            case MessageTypes.CONTACTS:
              this.lastMessage = latestMessage.contacts;
              break;
              case MessageTypes.IMAGE:
              case MessageTypes.AUDIO:
              case MessageTypes.DOCUMENT:
              case MessageTypes.LOCATION:  
              case MessageTypes.STICKER:
              case MessageTypes.VIDEO:
              case MessageTypes.REACTION:
                  this.lastMessage = latestMessage.type; 
                  this.imageSource = this.getImageSource();
                  break;
                     
            default:
              this.lastMessage = '';
          }        
      })
    ).subscribe();
  }

  getImageSource(): string {
    switch (this.lastMessage) {
      case MessageTypes.IMAGE:
        return 'assets/images/lib/block-builder/image-block-placeholder.jpg';
      case MessageTypes.AUDIO:
        return 'assets/images/lib/block-builder/audio-block-placeholder.png';
      case MessageTypes.DOCUMENT:
        return 'assets/images/lib/block-builder/docs-block-placeholder.png';
      case MessageTypes.LOCATION:
        return 'assets/images/lib/block-builder/docs-block-placeholder.png';
      case MessageTypes.STICKER:
        return 'assets/images/lib/block-builder/sticker-block-placeholder.png';
      case MessageTypes.VIDEO:
        return 'assets/images/lib/block-builder/video-block-placeholder.png';
      case MessageTypes.REACTION:
        return 'assets/images/lib/block-builder/sticker-block-placeholder.png';      
      default:
        return '';
    }
  }
  

  getClass()
  {
    if(this.chat.awaitingResponse)
      return 'needs-attention';

    switch(this.chat.flow)
    {
      case ChatFlowStatus.PausedByAgent:
      case ChatFlowStatus.Paused:
        return 'paused';
      default:
        return;
    }
  }

  ngOnDestroy() {
    this._sbs.unsubscribe();
  }
}
