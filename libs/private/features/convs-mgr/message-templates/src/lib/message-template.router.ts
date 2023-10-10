import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { MessageTemplateHomeComponent } from './pages/message-template-home/message-template-home.component';
import { MessageTemplateCreateComponent } from './pages/message-template-create/message-template-create.component';
import { MessageTemplateHelpComponent } from './pages/message-template-help/message-template-help.component';

const MESSAGING_ROUTES: Route[] = [
  {
    path: '',
    component: MessageTemplateHomeComponent,
  },
  {
    path: 'create',
    component: MessageTemplateCreateComponent,
  },
  {
    path: ':id', 
    component: MessageTemplateCreateComponent, 
  },
  {
    path: 'help', 
    component: MessageTemplateHelpComponent, 
  },

];

@NgModule({
  imports: [RouterModule.forChild(MESSAGING_ROUTES)],
  exports: [RouterModule],
})
export class MessageTemplateRouterModule {}