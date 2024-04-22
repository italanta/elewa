import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { FallbackMainPageComponent } from './pages/fallback-main-page/fallback-main-page.component';

import { FallbackRouterModule } from './fallbacks.router';

@NgModule({
  imports: [CommonModule, ConvlPageModule, FallbackRouterModule],
  declarations: [FallbackMainPageComponent],
})
export class FallbacksModule {}
