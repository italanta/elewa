import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QUESTION_BANK_ROUTES } from './question-banks.router.module';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(QUESTION_BANK_ROUTES)],
})
export class QuestionBanksModule {}
