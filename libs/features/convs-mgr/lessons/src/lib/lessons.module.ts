import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrLessonsRouterModule } from './lesson.routing';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    MultiLangModule,
    FlexLayoutModule,
    MaterialDesignModule,
    ConvsMgrLessonsRouterModule,
  ],
  declarations: []
})

// a story is a lesson
export class ConvsMgrLessonsModule {}
