import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsStore } from './stores/assessments.store';
import { ActiveAssessmentStore } from './stores/active-assessment.store';
import { AssessmentService } from './services/assessment.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    AssessmentsStore,
    ActiveAssessmentStore,
    AssessmentService
  ]
})
export class StateAssessmentsModule {}
