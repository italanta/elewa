import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ModulePageComponent } from './pages/module-page/module-page.component';

import { ConvsMgrModulesRouterModule } from './modules.routing';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    FlexLayoutModule,
    MaterialDesignModule,
    MultiLangModule,
    ConvsMgrModulesRouterModule,
  ],
  declarations: [
    ModulePageComponent
  ]
})
export class ConvsMgrModulesModule {}
