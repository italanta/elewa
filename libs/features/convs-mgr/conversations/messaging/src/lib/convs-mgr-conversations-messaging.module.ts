import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ButtonMessageComponent } from './components/button-message/button-message.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { MessagesContainerComponent } from './components/messages-container/messages-container.component';
import { NewMessageComponent } from './components/new-message/new-message.component';
import { ScrollPositionDirective } from './directives/scroll-position.directive';
import { VideoResourceMessageComponent } from './components/blocks/video-resource-message/video-resource-message.component';
import { AudioResourceMessageComponent } from './components/blocks/audio-resource-message/audio-resource-message.component';
import { DocumentResourceMessageComponent } from './components/blocks/document-resource-message/document-resource-message.component';
import { ListResourceMessageComponent } from './components/blocks/list-resource-message/list-resource-message.component';
import { ImageResourceMessageComponent } from './components/blocks/image-resource-message/image-resource-message.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    FormsModule,
  ],

  declarations: [
    ButtonMessageComponent,
    ChatMessageComponent,
    MessagesContainerComponent,
    NewMessageComponent,
    ScrollPositionDirective,
    VideoResourceMessageComponent,
    AudioResourceMessageComponent,
    DocumentResourceMessageComponent,
    ListResourceMessageComponent,
    ImageResourceMessageComponent,
  ],

  exports: [
    ButtonMessageComponent,
    ChatMessageComponent,
    MessagesContainerComponent,
    NewMessageComponent,
  ],
})
export class ConvsMgrConversationsMessagingModule {}
