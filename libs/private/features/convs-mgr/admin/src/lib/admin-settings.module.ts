import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { AdminPageComponent } from './pages/admin-page/admin-page.component';

import { AdminSettingsRouterModule } from './admin.routing';

@NgModule({
  imports: [
    CommonModule,
    AdminSettingsRouterModule,
    ConvlPageModule,
    MaterialBricksModule,
    MaterialDesignModule,
    MultiLangModule,
  ],
  declarations: [AdminPageComponent],
})
export class AdminSettingsModule {}
