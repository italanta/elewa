import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { LearnersPageComponent } from './pages/learners-page/learners-page.component';
import { SingleLearnerPageComponent } from './pages/single-learner-page/single-learner-page.component';

const LEARNERS_ROUTES: Route[] = [
  {
    path: '',
    component: LearnersPageComponent,
  },
  {
    path: ':id',
    component: SingleLearnerPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(LEARNERS_ROUTES)],
  exports: [RouterModule]
})
export class LearnersRouterModule { }
