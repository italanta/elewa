import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { CustomComponentsModule } from '@app/elements/layout/convs-mgr/custom-components';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { FallbackMainPageComponent } from './pages/fallback-main-page/fallback-main-page.component';

import { FallbackRouterModule } from './fallbacks.router';
import { FallbackModalComponent } from './modals/fallback-modal/fallback-modal.component';
import { ActionTableComponent } from './components/action-table/action-table.component';
import { FallbackService } from '@app/state/convs-mgr/fallback';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    FallbackRouterModule,
    MaterialBricksModule,
    MaterialDesignModule,
    MultiLangModule,
    CustomComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FallbackMainPageComponent,
    FallbackModalComponent,
    ActionTableComponent,
  ],
  providers: [FallbackService]
})
export class FallbacksModule {}
