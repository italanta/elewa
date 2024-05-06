import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { FallbackMainPageComponent } from './pages/fallback-main-page/fallback-main-page.component';

import { FallbackRouterModule } from './fallbacks.router';
import { FallbackModalComponent } from './modals/fallback-modal/fallback-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    FallbackRouterModule,
    MaterialBricksModule,
    MaterialDesignModule,
    MultiLangModule,
  ],
  declarations: [FallbackMainPageComponent, FallbackModalComponent],
})
export class FallbacksModule {}
