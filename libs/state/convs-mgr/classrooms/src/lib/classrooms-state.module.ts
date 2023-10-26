import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassroomStore } from './store/classroom.store';

@NgModule({
  imports: [CommonModule],
})
export class ClassroomStateModule {
  static forRoot(): ModuleWithProviders<ClassroomStateModule> {
    return {
      ngModule: ClassroomStateModule,
      providers: [ClassroomStore],
    };
  }
};
