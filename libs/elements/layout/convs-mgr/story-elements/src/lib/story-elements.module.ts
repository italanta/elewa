import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateBotModalComponent } from './modals/create-bot-modal/create-bot-modal.component';
import { DeleteBotModalComponent } from './modals/delete-bot-modal/delete-bot-modal.component';

import { BotCreateFlowModalComponent } from './modals/bot-create-flow-modal/bot-create-flow-modal.component';
import { CreateModuleModalComponent } from './modals/create-module-modal/create-module-modal.component';
import { CreateLessonModalComponent } from './modals/create-lesson-modal/create-lesson-modal.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CreateBotModalComponent,
    DeleteBotModalComponent,
    CreateModuleModalComponent,
    CreateLessonModalComponent,
    BotCreateFlowModalComponent,
  ],
})
export class ConvsMgrStoryElementsModule {}
