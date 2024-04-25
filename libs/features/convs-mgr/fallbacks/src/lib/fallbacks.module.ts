import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { FallbackMainPageComponent } from './pages/fallback-main-page/fallback-main-page.component';

import { FallbackRouterModule } from './fallbacks.router';
import { FallbackModalComponent } from './modals/fallback-modal/fallback-modal.component';

@NgModule({
  imports: [CommonModule, ConvlPageModule, FallbackRouterModule],
  declarations: [FallbackMainPageComponent, FallbackModalComponent],
})
export class FallbacksModule {}
