import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';

const ASSESSMENTS_ROUTERS: Route[] = [
  {
    path: '',
    component: AssessmentsHomeComponent,
    // children: [
    //   { path: '', component: ChatConversationComponent },
    //   { path: ':chatId', component: ChatConversationComponent }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTERS)],
  exports: [RouterModule]
})
export class AssessmentsRouterModule { }
