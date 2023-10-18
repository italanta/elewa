import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ConvsMgrLessonsModule } from '@app/features/convs-mgr/lessons';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ModulesListHeaderComponent } from './components/modules-list-header/modules-list-header.component';
import { ModulePageComponent } from './pages/module-page/module-page.component';

import { ConvsMgrModulesRouterModule } from './modules.routing';
import { BotModulesListViewComponent } from './components/bot-modules-list-view/bot-modules-list-view.component';
import { BotModulesGridViewComponent } from './components/bot-modules-grid-view/bot-modules-grid-view.component';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    FlexLayoutModule,
    MaterialDesignModule,
    MultiLangModule,
    ConvsMgrModulesRouterModule,
    ConvsMgrLessonsModule,
  ],
  declarations: [
    ModulesListHeaderComponent,
    ModulePageComponent,
    BotModulesListViewComponent,
    BotModulesGridViewComponent,
  ],
  exports: [ModulesListHeaderComponent],
})
export class ConvsMgrModulesModule {}
