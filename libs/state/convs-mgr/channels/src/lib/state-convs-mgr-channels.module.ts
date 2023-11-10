import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelsStore } from './store/channel.store';

@NgModule({
  imports: [CommonModule],
})
export class ChannelsStateModule {
  static forRoot(): ModuleWithProviders<ChannelsStateModule> {
    return {
      ngModule: ChannelsStateModule,
      providers: [ChannelsStore],
    };
  }
}
