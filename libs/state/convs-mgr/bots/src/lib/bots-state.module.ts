import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotsStore } from './stores/bots.store';

@NgModule({
  imports: [CommonModule],
})
export class BotsStateModule {
  static forRoot(): ModuleWithProviders<BotsStateModule> {
    return {
      ngModule: BotsStateModule,
      providers: [BotsStore],
    };
  }
}
