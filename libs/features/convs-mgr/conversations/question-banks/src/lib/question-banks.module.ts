import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ConvsMgrAssessmentsModule } from '@app/features/convs-mgr/conversations/assessments';

import { QuestionBankListComponent } from './components/question-bank-list/question-bank-list.component';
import { QuestionBankHeaderComponent } from './components/question-bank-header/question-bank-header.component';
import { QuestionBankRouterModule } from './question-banks.router.module';
import { QuestionBankQuestionFormComponent } from './components/question-bank-question-form/question-bank-question-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,
    ReactiveFormsModule,

    QuestionBankRouterModule,
    ConvlPageModule,

    ConvsMgrAssessmentsModule,
  ],
  declarations: [
    QuestionBankListComponent,
    QuestionBankHeaderComponent,
    QuestionBankQuestionFormComponent,
  ],
})
export class QuestionBanksModule {}
