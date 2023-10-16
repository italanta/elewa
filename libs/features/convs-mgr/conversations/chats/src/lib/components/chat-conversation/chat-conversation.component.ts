import { Component, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Subscription, concatMap, map, tap } from 'rxjs';

import { Logger } from '@iote/bricks-angular';

import {
  ActiveChatConnectedStore,
  ChatsStore,
} from '@app/state/convs-mgr/conversations/chats';

import { Chat, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { Story } from '@app/model/convs-mgr/stories/main';
import { EndUserPosition } from '@app/model/convs-mgr/conversations/admin/system';
import { GET_RANDOM_COLOR } from '../../providers/avatar.provider';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss'],
})
export class ChatConversationComponent implements OnInit, OnDestroy {
  private _sbs = new SubSink();
  chat: Chat;
  /** variable to track the current chat*/ 
  currentChat: Chat;
  chat$: Subscription;
  isLoading = true;

  currentPosition: EndUserPosition;
  currentStory: Story;
  chatStatus: string;
  userClass: string;
  chatAvatarColor: string;

  /**dummy chat data */
  dummyChat: Chat = {
    id: 'dummyChatId',
    phoneNumber: '0987654321',
    name: 'Darlene',
    labels: [],
    channelId: '',
    channelName: '',
    status: ChatStatus.Running
  };

  dummyChat2: Chat = {
    id: 'dummyChatId2',
    phoneNumber: '1234567890',  
    name: 'John', 
    labels: [],
    channelId: '',
    channelName: '',
    status: ChatStatus.Running
  };

  constructor(
    private _activeChat$: ActiveChatConnectedStore,
    private _chatStore: ChatsStore,
    private _logger: Logger,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (!this.chat) {
      this.getActiveChat();
    }
    /** dummy chat for testing */
    this.chat = this.dummyChat;
    this.currentChat = this.dummyChat; 

    this.loadChat();
  }

  loadChat() {
    // Focus on the most recent message
    setTimeout(() => {
      const chatContainer = this.elementRef.nativeElement.querySelector('#chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }

  getActiveChat() {
    this._sbs.sink = this._activeChat$
      .get()
      .pipe(
        tap((chat) => {
          if (chat?.id) {
            this.chat = chat;
            this.chatAvatarColor = GET_RANDOM_COLOR();
          }
        }),
        tap(() => this.getChatInfo())
      )
      .subscribe();
  }

  getChatInfo() {
    this.getUserClass();
    this._sbs.sink = this.getCurrentUserPosAndStory(this.chat.id).subscribe();
    this.chatStatus = this.getUserChatStatus(this.chat);
  }

  getUserClass() {
    if (this.chat.labels) {
      const userClass = this.chat.labels.map((label) => {
        const split = label.split('_');
        return split[1];
      });

      this.userClass = userClass[0];
    } else {
      this.userClass = '';
    }
  }

  getUserChatStatus(chat: Chat) {
    switch (chat.isConversationComplete) {
      case -1:
        return 'Stuck';
      default:
        return 'Playing';
    }
  }

  getCurrentUserPosAndStory(chatId: string) {
    return this._chatStore.getCurrentCursor(chatId).pipe(
      map((cur) => {
        // Set the current position of the user in the story
        this.currentPosition = cur[0].position;
        return cur[0].position.storyId;
      }),
      concatMap((id) => {
        return this._chatStore.getCurrentStory(id);
      }),
      map((story) => {
        if (story) {
          this.currentStory = story;
        }
        return story;
      })
    );
  }

  ngOnDestroy() {
    this._sbs.unsubscribe();
  }
}
