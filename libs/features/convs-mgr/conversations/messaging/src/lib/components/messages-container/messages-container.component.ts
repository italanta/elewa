import { orderBy as __orderBy } from 'lodash';

import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { __DateFromStorage } from '@iote/time';
import { Logger } from '@iote/bricks-angular';
import { PaginatedScroll } from '@ngfi/infinite-scroll';

import { MessagesQuery } from '@app/state/convs-mgr/conversations/messages';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { Chat } from '@app/model/convs-mgr/conversations/chats';

import { ChatMessageComponent } from '../chat-message/chat-message.component';

import { SpinnerService } from '../../providers/spinner.service';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls:  ['./messages-container.component.scss']
})
export class MessagesContainerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  private _sbs = new SubSink()
  @Input() chat: Chat;

  lastDate: moment.Moment;
  unblocking$: Observable<boolean>;

  messages:  Message[];
  messages$: Observable<Message[]>;

  @ViewChild('container') private _container: ElementRef;
  @ViewChildren(ChatMessageComponent) chatMessages: QueryList<ChatMessageComponent>;
  model: PaginatedScroll<Message>;

  isLoaded = false;
  newMessages = false;
  paginationNumber = 1

  constructor(private _messages$$: MessagesQuery,
              private _cd: ChangeDetectorRef,
              private _logger: Logger,
              private _spinner: SpinnerService
  ){}

  ngOnInit() {
    this.unblocking$ = this._spinner.showSpinner$
  
  }

  ngAfterViewInit(): void {
    /**
     * Subscribes to changes in the chat messages and scrolls to the last message at first time .
     *  considering pagination which value changes on this.model.loadMore()
     * 
     * @listens ChatMessageComponent[]
     */
    // TODO:@LemmyMwaura - when we add this to our sink, the scroll to bottom no longer works. Check back at this later.
    this.chatMessages.changes.subscribe(() => {
      // Calculate the index of the message to scroll to
      const scrollToIndex = this.chatMessages.length - this.paginationNumber;

      // Scroll to the calculated index
      this.scrollToMessage(scrollToIndex);
    });
  }

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

    this._sbs.unsubscribe();

    this.model = this._messages$$.getPaginator(this.chat);
    this.messages$ = this.model.get();
    

    this._sbs.sink =  this.messages$.subscribe(msgs => {
      this._logger.log(() => '[MessagesContainerComponent] - Detected change in messages-subscr');
      
      // TODO: Weird bug in paginator seems to skip ordering on new load, so we re-order here.
      this.messages = __orderBy(msgs, m => __DateFromStorage(m.createdOn as Date));

      // this.messages = this.messages.filter(msg => msg.type !== MessageTypes.Event)

      this.chat.lastMsg = this.messages[this.messages.length - 1]

      if(!this.isLoaded) {
        this.isLoaded = true;
      }
      else {
        this.newMessages = true;
      }

      this._cd.detectChanges();
    });
  }

  scrollHandler(e: any) : void
  {
    if(this.isLoaded)
    {
      if (e === 'top'){
        this.model.more();
        this.paginationNumber = this.messages.length + 1;
      }
      else if(e === 'bottom')
        this.newMessages = false;
    }

  }

  scrollToBottom(): void
  {
    try {
      this._container.nativeElement.scrollTop = this._container.nativeElement.scrollHeight;
    }
    catch(err) { /* empty */ }
  }

  isNewDate(message: Message)
  {
    const newDate = __DateFromStorage(message.createdOn as Date);
    if(!this.lastDate || this.lastDate.diff(newDate, 'days'))
    {
      this.lastDate = newDate;
      return true;
    }
    return false;
  }

  /**
 * Scrolls to the message at the specified index.
 *
 * @private
 * @param {number} index - The index of the message to scroll to.
 * @returns {void}
 */
  private scrollToMessage(index: number): void {
    const scrollContainer = this._container.nativeElement;
    const messageComponent = this.chatMessages.toArray()[index];

    if (messageComponent) {
      const messageElement = this.getMessageElement(messageComponent);

      if (messageElement) {
        scrollContainer.scrollTop = messageElement.offsetTop;
      }
    }
  }

  /**
 * Retrieves the HTML element associated with the given chat message component.
 *
 * @private
 * @param {ChatMessageComponent} messageComponent - The chat message component.
 * @returns {HTMLElement | null} The HTML element or null if not found.
 */
  private getMessageElement(messageComponent: ChatMessageComponent): HTMLElement | null {
    return messageComponent.getElementRef();
  }

  ngOnDestroy()
  {
    this.model.detachListeners();
    this._sbs.unsubscribe();
  }
}
