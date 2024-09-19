import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout';

import { MultiLangModule } from '@ngfi/multi-lang';
import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ConvsMgrAssessmentsModule } from '@app/features/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';

import { QuestionBankListComponent } from './components/question-bank-list/question-bank-list.component';
import { QuestionBankHeaderComponent } from './components/question-bank-header/question-bank-header.component';
import { QuestionCardComponent } from './components/question-card/question-card.component';
import { DeleteQuestionModalComponent } from './components/delete-question-modal/delete-question-modal.component';
import { AddQuestionToAssessmentComponent } from './components/add-question-to-assessment/add-question-to-assessment.component';
import { QuestionBankRouterModule } from './question-banks.router.module';
import { ElementsLayoutModalsModule } from '@app/elements/layout/modals';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialBricksModule,
    MaterialDesignModule,
    FormsModule,
    MatSnackBarModule,
    ElementsLayoutModalsModule,
    QuestionBankRouterModule,
    ConvlPageModule,

    ConvsMgrAssessmentsModule,
  ],
  declarations: [
    QuestionBankListComponent,
    QuestionBankHeaderComponent,
    QuestionCardComponent,
    DeleteQuestionModalComponent,
    AddQuestionToAssessmentComponent,
  ],
  providers: [AssessmentQuestionBankStore],
})
export class QuestionBanksModule {}
