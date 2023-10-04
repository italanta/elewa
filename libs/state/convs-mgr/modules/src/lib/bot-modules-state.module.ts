import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotModulesStore } from './stores/bot-module.stores';

@NgModule({
  imports: [CommonModule],
})
export class BotModulesStateModule {
  static forRoot(): ModuleWithProviders<BotModulesStateModule> {
    return {
      ngModule: BotModulesStateModule,
      providers: [BotModulesStore],
    };
  }
}
