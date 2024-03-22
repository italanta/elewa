import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang'; 

import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';

import { ModulePageComponent } from './pages/module-page/module-page.component';

import { StoriesListHeaderComponent } from './components/stories-list-header/stories-list-header.component';
import { ModulesLessonsListViewComponent } from './components/modules-lessons-list-view/modules-lessons-list-view.component';
import { ModulesLessonsGridViewComponent } from './components/modules-lessons-grid-view/modules-lessons-grid-view.component';

import { ConvsMgrModulesRouterModule } from './modules.routing';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    FlexLayoutModule,
    MaterialDesignModule,
    MultiLangModule,
    ConvsMgrModulesRouterModule,
    ItalBreadCrumbModule
  ],
  declarations: [
    ModulePageComponent,
    StoriesListHeaderComponent,
    ModulesLessonsGridViewComponent,
    ModulesLessonsListViewComponent
  ]
})
export class ConvsMgrModulesModule {}
