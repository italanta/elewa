import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

export const QUESTION_BANK_ROUTES: Route[] = [
  /* { path: '', pathMatch: 'full', component: InsertYourComponentHere } */
];


@NgModule({
  imports: [RouterModule.forChild(QUESTION_BANK_ROUTES)],
  exports: [RouterModule]
})

export class QuestionBankRouterModule {}