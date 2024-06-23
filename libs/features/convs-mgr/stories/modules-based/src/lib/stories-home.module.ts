import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ChatsRouterModule } from '@app/features/convs-mgr/conversations/chats';

import { CourseModuleItemComponent } from './components/courses/course-module-item/course-module-item.component';

import { BotModulesListHeaderComponent } from './components/modules/modules-list-header/modules-list-header.component';
import { BotModulesListViewComponent } from './components/modules/bot-modules-list-view/bot-modules-list-view.component';
import { BotModulesGridViewComponent } from './components/modules/bot-modules-grid-view/bot-modules-grid-view.component';

import { BotPageComponent } from './pages/bot-page/bot-page.component';

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
    FormsModule,
    ItalBreadCrumbModule,
  ],
  declarations: [
    BotPageComponent,
    CourseModuleItemComponent,
    BotModulesGridViewComponent,
    BotModulesListViewComponent,
    BotModulesListHeaderComponent,
  ],
})
export class ConvsMgrStoriesHomeModule {}
