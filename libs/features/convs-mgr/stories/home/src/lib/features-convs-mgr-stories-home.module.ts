import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ConvsMgrModulesModule } from '@app/features/convs-mgr/modules';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ChatsRouterModule } from '@app/features/convs-mgr/conversations/chats';

import { StoryListItemComponent } from './components/story-list-item/story-list-item.component';
import { BotsListHeaderComponent } from './components/bots-list-header/bots-list-header.component';
import { BotsListAllCoursesComponent } from './components/bots-list-all-courses/bots-list-all-courses.component';
import { BotsListLatestCoursesComponent } from './components/bots-list-latest-courses/bots-list-latest-courses.component';
import { CoursesListComponent } from './components/courses/courses-list/courses-list.component';
import { CourseModuleItemComponent } from './components/courses/course-module-item/course-module-item.component';

import { BotModulesListHeaderComponent } from './components/modules/modules-list-header/modules-list-header.component';
import { BotModulesListViewComponent } from './components/modules/bot-modules-list-view/bot-modules-list-view.component';
import { BotModulesGridViewComponent } from './components/modules/bot-modules-grid-view/bot-modules-grid-view.component';

import { BotPageComponent } from './pages/bot-page/bot-page.component';
import { StoriesDashboardComponent } from './pages/stories-dashboard/stories-dashboard.component';
import { CoursesViewAllPageComponent } from './pages/courses-view-all-page/courses-view-all-page.component';

import { CreateBotModalComponent } from './modals/create-bot-modal/create-bot-modal.component';
import { DeleteBotModalComponent } from './modals/delete-bot-modal/delete-bot-modal.component';

import { BotCreateFlowModalComponent } from './modals/bot-create-flow-modal/bot-create-flow-modal.component';
import { CreateModuleModalComponent } from './modals/create-module-modal/create-module-modal.component';
import { CreateLessonModalComponent } from './modals/create-lesson-modal/create-lesson-modal.component';

import { ConvsMgrStoriesRouterModule } from './stories.router';
import { FilterCoursePipe } from './pipes/filter-course.pipe';

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
    FormsModule
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
    CoursesViewAllPageComponent,
    CoursesListComponent,
    CourseModuleItemComponent,
    FilterCoursePipe,
    BotModulesGridViewComponent,
    BotModulesListViewComponent,
    BotModulesListHeaderComponent
  ],
})
export class ConvsMgrStoriesHomeModule {}
