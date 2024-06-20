import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FallbackStore } from './store/fallback.store';

@NgModule({
  imports: [CommonModule],
})
export class FallbackStateModule {
  static forRoot(): ModuleWithProviders<FallbackStateModule> {
    return {
      ngModule: FallbackStateModule,
      providers: [FallbackStore],
    };
  }
}
