import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { questionBanksRoutes } from './question-banks.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(questionBanksRoutes)],
})
export class QuestionBanksModule {}
