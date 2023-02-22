import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ChatCardComponent } from './components/chat-card/chat-card.component';
import { ChatConversationComponent } from './components/chat-conversation/chat-conversation.component';
import { ChatDetailHeaderComponent } from './components/chat-detail-header/chat-detail-header.component';
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { ChatsOverviewTableComponent } from './components/chats-overview-table/chats-overview-table.component';

import { ConfirmActionModal } from './modals/confirm-action-modal/confirm-action-modal.component';
import { StashChatModal } from './modals/stash-chat-modal/stash-chat-modal.component';
import { ViewDetailsModal } from './modals/view-details-modal/view-details-modal.component';
import { MoveChatModal } from './modals/move-chat-modal/move-chat-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],

  declarations: [
    ChatCardComponent,
    ChatConversationComponent,
    ChatDetailHeaderComponent,
    ChatsListComponent,
    ChatsOverviewTableComponent,
    ConfirmActionModal,
    ViewDetailsModal,
    MoveChatModal,
    StashChatModal,
  ]
})
export class FeaturesConvsMgrConversationsChatsModule { }
