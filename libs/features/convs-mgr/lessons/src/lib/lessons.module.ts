import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { StoriesListHeaderComponent } from './components/stories-list-header/stories-list-header.component';

import { ConvsMgrLessonsRouterModule } from './lesson.routing';
import { ModulesLessonsListViewComponent } from './components/modules-lessons-list-view/modules-lessons-list-view.component';
import { ModulesLessonsGridViewComponent } from './components/modules-lessons-grid-view/modules-lessons-grid-view.component';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    MultiLangModule,
    FlexLayoutModule,
    MaterialDesignModule,
    ConvsMgrLessonsRouterModule,
  ],
  declarations: [
    StoriesListHeaderComponent,
    ModulesLessonsListViewComponent,
    ModulesLessonsGridViewComponent,
  ],
  exports: [StoriesListHeaderComponent],
})

// a story is a lesson
export class ConvsMgrLessonsModule {}
