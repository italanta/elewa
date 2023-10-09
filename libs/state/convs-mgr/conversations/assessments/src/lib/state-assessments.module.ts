import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsStore } from './stores/assessments.store';
import { ActiveAssessmentStore } from './stores/active-assessment.store';
import { AssessmentService } from './services/assessment.service';
import { AssessmentQuestionService } from './services/assessment-question.service';
import { AssessmentQuestionStore } from './stores/assessment-question.store';
import { AssessmentPublishService } from './services/assessment-publish.service';
import { NewStoryService } from 'libs/features/convs-mgr/stories/home/src/lib/services/new-story.service';

@NgModule({
  imports: [CommonModule],
})
export class StateAssessmentsModule {
  static forRoot(): ModuleWithProviders<StateAssessmentsModule> {
    return {
      ngModule: StateAssessmentsModule,
      providers: [
        AssessmentsStore,
        AssessmentQuestionStore,
        ActiveAssessmentStore,
        AssessmentService,
        AssessmentQuestionService,
        AssessmentPublishService,
      ],
    };
  }
}
