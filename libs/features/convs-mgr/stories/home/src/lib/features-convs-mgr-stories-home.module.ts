import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
import { ConvsMgrModulesModule } from '@app/features/convs-mgr/modules';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ChatsRouterModule } from '@app/features/convs-mgr/conversations/chats';

import { StoryListItemComponent } from './components/story-list-item/story-list-item.component';
import { BotsListHeaderComponent } from './components/bots-list-header/bots-list-header.component';
import { BotsListAllCoursesComponent } from './components/bots-list-all-courses/bots-list-all-courses.component';
import { BotsListLatestCoursesComponent } from './components/bots-list-latest-courses/bots-list-latest-courses.component';
import { BotPageComponent } from './pages/bot-page/bot-page.component';

import { StoriesDashboardComponent } from './pages/stories-dashboard/stories-dashboard.component';

import { CreateBotModalComponent } from './modals/create-bot-modal/create-bot-modal.component';
import { DeleteBotModalComponent } from './modals/delete-bot-modal/delete-bot-modal.component';

import { NewStoryService } from './services/new-story.service';

import { BotCreateFlowModalComponent } from './modals/bot-create-flow-modal/bot-create-flow-modal.component';
import { CreateModuleModalComponent } from './modals/create-module-modal/create-module-modal.component';
import { CreateLessonModalComponent } from './modals/create-lesson-modal/create-lesson-modal.component';

import { ConvsMgrStoriesRouterModule } from './stories.router';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    FlexLayoutModule,
    ConvlPageModule,
    MultiLangModule,
    ConvsMgrStoriesRouterModule,
    ChatsRouterModule,
    MatStepperModule,
    ConvsMgrModulesModule,
  ],
  declarations: [
    StoriesDashboardComponent,
    StoryListItemComponent,
    CreateBotModalComponent,
    DeleteBotModalComponent,
    StoriesDashboardComponent,
    BotsListHeaderComponent,
    BotsListLatestCoursesComponent,
    BotsListAllCoursesComponent,
    BotCreateFlowModalComponent,
    CreateModuleModalComponent,
    CreateLessonModalComponent,
    BotPageComponent,
  ],

  providers: [NewStoryService],
})
export class ConvsMgrStoriesHomeModule {}
