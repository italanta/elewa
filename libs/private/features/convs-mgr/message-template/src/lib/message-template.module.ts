import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTemplateHomeComponent } from './pages/message-template-home/message-template-home.component';
import { MessageTemplateFormComponent } from './components/message-template-form/message-template-form.component';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { MessageTemplateRouterModule } from './message-template.router.module';
import { MessageTemplateListComponent } from './components/message-template-list/message-template-list.component';
import { MessageTemplateHeaderComponent } from './components/message-template-header/message-template-header.component';
import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MessageTemplateCreateComponent } from './pages/message-template-create/message-template-create.component';
import { MessageTemplateViewComponent } from './pages/message-template-view/message-template-view.component';
import { MessageTemplateStore, MessageTemplatesService } from '@app/private/state/message-templates';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    MessageTemplateRouterModule,
    MaterialBricksModule,
    MaterialDesignModule,
  ],
  declarations: [
    MessageTemplateHomeComponent,
    MessageTemplateFormComponent,
    MessageTemplateListComponent,
    MessageTemplateHeaderComponent,
    MessageTemplateCreateComponent,
    MessageTemplateViewComponent,
  ],
  providers: [
    MessageTemplatesService,
    MessageTemplateStore
  ]
})
export class MessageTemplateModule {}
