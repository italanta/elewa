import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsStore } from './stores/assessments.store';
import { ActiveAssessmentStore } from './stores/active-assessment.store';
import { AssessmentService } from './services/assessment.service';
import { AssessmentQuestionService } from './services/assessment-question.service';
import { AssessmentQuestionStore } from './stores/assessment-question.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    AssessmentsStore,
    AssessmentQuestionStore,
    ActiveAssessmentStore,
    AssessmentService,
    AssessmentQuestionService
  ]
})
export class StateAssessmentsModule {}
