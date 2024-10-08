import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { QuestionBankListComponent } from './components/question-bank-list/question-bank-list.component';

export const QUESTION_BANK_ROUTES: Route[] = [
   { path: '', pathMatch: 'full', component: QuestionBankListComponent }
];


@NgModule({
  imports: [RouterModule.forChild(QUESTION_BANK_ROUTES)],
  exports: [RouterModule]
})

export class QuestionBankRouterModule {}