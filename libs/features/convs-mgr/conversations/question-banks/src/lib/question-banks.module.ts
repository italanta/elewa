import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { QuestionBankListComponent } from './components/question-bank-list/question-bank-list.component';
import { QuestionBankHeaderComponent } from './components/question-bank-header/question-bank-header.component';
import { QuestionBankRouterModule } from './question-banks.router.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,

    QuestionBankRouterModule,
    ConvlPageModule
  ],
  declarations: [QuestionBankListComponent, QuestionBankHeaderComponent],
})
export class QuestionBanksModule {}
