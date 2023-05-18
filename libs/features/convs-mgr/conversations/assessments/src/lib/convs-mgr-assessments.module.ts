import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AssessmentService, AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { AssessmentsRouterModule } from './assessments.router.module';
import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentViewComponent } from './pages/assessment-view/assessment-view.component';
import { AssessmentEditComponent } from './pages/assessment-edit/assessment-edit.component';
import { CreateAssessmentModalComponent } from './modals/create-assessment-modal/create-assessment-modal.component';
import { AssessmentListComponent } from './components/assessment-list/assessment-list.component';
import { AssessmentListItemComponent } from './components/assessment-list-item/assessment-list-item.component';
import { AssessmentQuestionComponent } from './components/assessment-question/assessment-question.component';
import { AssessmentAnswerComponent } from './components/assessment-answer/assessment-answer.component';
import { AssessmentQuestionsComponent } from './components/assessment-questions/assessment-questions.component';
import { AssessmentAnswersComponent } from './components/assessment-answers/assessment-answers.component';
import { AssessmentConfigComponent } from './components/assessment-config/assessment-config.component';
import { AssessmentFormService } from './services/assessment-form.service';

@NgModule({
  imports: [CommonModule,
            AssessmentsRouterModule,
            MaterialBricksModule,
            MaterialDesignModule,
            MultiLangModule,
            RouterModule,
            FormsModule,
            ReactiveFormsModule,
            ConvlPageModule,
            FlexLayoutModule
          ],
  declarations: [AssessmentsHomeComponent,
                 AssessmentListComponent,
                 AssessmentViewComponent,
                 AssessmentListItemComponent,
                 AssessmentEditComponent,
                 AssessmentQuestionsComponent,
                 AssessmentQuestionComponent,
                 AssessmentAnswersComponent,
                 AssessmentAnswerComponent,
                 AssessmentConfigComponent,
                 CreateAssessmentModalComponent],
  providers: [AssessmentService,
              AssessmentFormService,
              AssessmentsStore]
})
export class ConvsMgrAssessmentsModule {}
