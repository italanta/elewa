import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsStore } from './stores/assessments.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    AssessmentsStore
  ]
})
export class StateAssessmentsModule {}
