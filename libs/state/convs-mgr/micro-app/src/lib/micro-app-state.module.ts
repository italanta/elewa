import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroAppStore } from './stores/micro-app.store';

@NgModule({
  imports: [CommonModule]
})
export class MicroAppStateModule 
{
  static forRoot(): ModuleWithProviders<MicroAppStateModule> {
    return {
      ngModule: MicroAppStateModule,
      providers: [
        MicroAppStore
      ]
    };
  }
}
