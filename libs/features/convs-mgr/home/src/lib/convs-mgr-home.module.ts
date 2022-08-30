import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { HomePageComponent } from './pages/home/home.page';
import { StoryListItemComponent } from './components/story-list-item/story-list-item.component';

import { NewStoryService } from './services/new-story.service';

import { ConvsMgrHomeRouterModule } from './convs-mgr-home.router.module';
import { StoryListComponent } from './components/story-list/story-list.component';
import { CreateBotModalComponent } from './modals/create-bot-modal/create-bot-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,

    ConvlPageModule,

    ConvsMgrHomeRouterModule,
  ],

  declarations: [
    HomePageComponent,
    StoryListItemComponent,
    StoryListComponent,
    CreateBotModalComponent,
  ],

  providers: [NewStoryService],
})
export class ConvsMgrHomeModule {}
