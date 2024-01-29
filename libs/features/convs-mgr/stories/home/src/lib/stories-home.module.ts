import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ChatsRouterModule } from '@app/features/convs-mgr/conversations/chats';

import { BotsListHeaderComponent } from './components/bots/bots-list-header/bots-list-header.component';
import { BotsListAllCoursesComponent } from './components/bots/bots-list-all-courses/bots-list-all-courses.component';
import { BotsListLatestCoursesComponent } from './components/bots/bots-list-latest-courses/bots-list-latest-courses.component';

import { CoursesListComponent } from './components/courses/courses-list/courses-list.component';
import { CourseModuleItemComponent } from './components/courses/course-module-item/course-module-item.component';

import { BotModulesListHeaderComponent } from './components/modules/modules-list-header/modules-list-header.component';
import { BotModulesListViewComponent } from './components/modules/bot-modules-list-view/bot-modules-list-view.component';
import { BotModulesGridViewComponent } from './components/modules/bot-modules-grid-view/bot-modules-grid-view.component';

import { BotPageComponent } from './pages/bot-page/bot-page.component';
import { StoriesDashboardComponent } from './pages/stories-dashboard/stories-dashboard.component';
import { CoursesViewAllPageComponent } from './pages/courses-view-all-page/courses-view-all-page.component';

import { ConvsMgrStoriesRouterModule } from './stories.router';
import { FilterCoursePipe } from './pipes/filter-course.pipe';
import { ConnectToChannelModalComponent } from './modals/connect-to-channel-modal/connect-to-channel-modal.component';
import { SpinnerModalComponent } from './modals/spinner-modal/spinner-modal.component';
import { ChannelComponent } from './modals/channel/channel.component';
import { MainChannelModalComponent } from './modals/main-channel-modal/main-channel-modal.component';

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
    FormsModule,
    ItalBreadCrumbModule,
  ],
  declarations: [
    StoriesDashboardComponent,
    StoriesDashboardComponent,
    BotsListHeaderComponent,
    BotsListLatestCoursesComponent,
    BotsListAllCoursesComponent,
    BotPageComponent,
    CoursesViewAllPageComponent,
    CoursesListComponent,
    CourseModuleItemComponent,
    FilterCoursePipe,
    BotModulesGridViewComponent,
    BotModulesListViewComponent,
    BotModulesListHeaderComponent,
    ConnectToChannelModalComponent,
    SpinnerModalComponent,
    ChannelComponent,
    MainChannelModalComponent,
  ],
})
export class ConvsMgrStoriesHomeModule {}
