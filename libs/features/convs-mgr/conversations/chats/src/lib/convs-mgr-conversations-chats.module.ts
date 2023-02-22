import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvsMgrConversationsMessagingModule } from '@app/features/convs-mgr/conversations/messaging';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ChatsRouterModule } from './chats.router.module';

import { ChatsHomePage } from './pages/chats-home/chats-home.page';
import { ChatsDetailPage } from './pages/chats-detail/chats-detail.page';

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
    ReactiveFormsModule,
    ConvlPageModule,
    ConvsMgrConversationsMessagingModule,
    FlexLayoutModule,
    ChatsRouterModule
  ],

  declarations: [
    ChatsHomePage,
    ChatsDetailPage,

    ChatCardComponent,
    ChatConversationComponent,
    ChatDetailHeaderComponent,
    ChatsListComponent,
    ChatsOverviewTableComponent,
    
    ConfirmActionModal,
    ViewDetailsModal,
    MoveChatModal,
    StashChatModal
  ]
})
export class ConvsMgrConversationsChatsModule { }
