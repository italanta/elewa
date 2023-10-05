import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { LessonDashboardComponent } from './pages/lesson-dashboard/lesson-dashboard.component';
import { StoriesListHeaderComponent } from './components/stories-list-header/stories-list-header.component';
import { StoriesListAllCoursesComponent } from './components/stories-list-all-courses/stories-list-all-courses.component';

import { ConvsMgrLessonsRouterModule } from './lesson.routing';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    MultiLangModule,
    FlexLayoutModule,
    MaterialDesignModule,
    ConvsMgrLessonsRouterModule
  ],
  declarations: [
    LessonDashboardComponent,
    StoriesListHeaderComponent,
    StoriesListAllCoursesComponent,
  ],
})

// a story is a lesson
export class ConvsMgrLessonsModule {}
