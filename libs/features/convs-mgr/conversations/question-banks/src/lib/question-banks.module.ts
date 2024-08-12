import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QUESTION_BANK_ROUTES } from './question-banks.router.module';
import { QuestionBankListComponent } from './components/question-bank-list/question-bank-list.component';


@NgModule({
  imports: [CommonModule, RouterModule.forChild(QUESTION_BANK_ROUTES)],
  declarations: [
    QuestionBankListComponent
  ],
})
export class QuestionBanksModule {}
