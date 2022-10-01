import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { ConvsMgrHomeRouterModule } from './convs-mgr-home.router.module';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { MultiLangModule } from '@ngfi/multi-lang';
import { NewStoryService } from './services/new-story.service';

import { StoryListItemComponent } from './components/story-list-item/story-list-item.component';
import { StoryListComponent } from './components/story-list/story-list.component';
import { HomePageComponent } from './pages/home/home.page';
import { CreateBotModalComponent } from './modals/create-bot-modal/create-bot-modal.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,

    ConvlPageModule,

    ConvsMgrHomeRouterModule,
    MultiLangModule,
    FontAwesomeModule,
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
