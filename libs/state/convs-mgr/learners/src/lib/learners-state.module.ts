import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnersStore } from './store/learners.store';

@NgModule({
  imports: [CommonModule],
})
export class LearnersStateModule {
  static forRoot(): ModuleWithProviders<LearnersStateModule> {
    return {
      ngModule: LearnersStateModule,
      providers: [LearnersStore],
    };
  }
}
