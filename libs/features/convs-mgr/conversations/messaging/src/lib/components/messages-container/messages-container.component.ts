import { Component, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { __DateFromStorage } from '@iote/time';
import { Logger }            from '@iote/bricks-angular';
import { PaginatedScroll }   from '@ngfire/infinite-scroll';

import { ChatMessage, MessageTypes }   from '@elewa/model/conversations/messages';
import { MessagesQuery } from '@elewa/state/conversations/messages';
import { Chat } from '@elewa/model/conversations/chats';


@Component({
  selector: 'elewa-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls:  ['./messages-container.component.scss']
})
export class MessagesContainerComponent implements OnInit, OnChanges, OnDestroy
{
  @Input() chat: Chat;

  lastDate: moment.Moment;

  subscription: Subscription;

  messages:  ChatMessage[];
  messages$: Observable<ChatMessage[]>;

  @ViewChild('container') private _container: ElementRef;
  model: PaginatedScroll<ChatMessage>;

  isLoaded = false;
  newMessages = false;

  constructor(private _messages$$: MessagesQuery,
              private _cd: ChangeDetectorRef,
              private _logger: Logger,
              private router: Router)
  {}

  ngOnInit()
  {  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['chat'])
    {
      this.chat = changes['chat'].currentValue;
      this.getData();
    }
  }

  getData()
  {
    if(!this.chat) return;

    if(this.subscription)
    {
      this.subscription.unsubscribe();
    }

    this.model = this._messages$$.getPaginator(this.chat);
    this.messages$ = this.model.get();

    this.subscription =  this.messages$.subscribe(msgs => {
      this._logger.log(() => '[MessagesContainerComponent] - Detected change in messages-subscr');

      // TODO: Weird bug in paginator seems to skip ordering on new load, so we re-order here.
      this.messages = _.orderBy(msgs, m => __DateFromStorage(m.date));

      this.messages = this.messages.filter(msg => msg.type !== MessageTypes.Event)

      this.chat.lastMsg = this.messages[this.messages.length - 1]

      if(!this.isLoaded) {
        this.isLoaded = true;
        setTimeout(() => this.scrollToBottom(), 400);
      }
      else {
        this.newMessages = true;
      }

      this._cd.detectChanges();
    });
  }

  scrollHandler(e) : void
  {
    if(this.isLoaded)
    {
      if (e === 'top')
        this.model.more();
      else if(e === 'bottom')
        this.newMessages = false;
    }

  }

  scrollToBottom(): void
  {
    try {
      this._container.nativeElement.scrollTop = this._container.nativeElement.scrollHeight;
    }
    catch(err) { }
  }

  isNewDate(message: ChatMessage)
  {
    const newDate = __DateFromStorage(message.createdOn);
    if(!this.lastDate || this.lastDate.diff(newDate, 'days'))
    {
      this.lastDate = newDate;
      return true;
    }
    return false;
  }

  ngOnDestroy()
  {
    this.model.detachListeners();
  }
}
