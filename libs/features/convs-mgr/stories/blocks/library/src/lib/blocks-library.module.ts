import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { BlockComponent } from './components/block/block.component';
import { MessageBlockComponent } from './components/message-block/message-block.component';
import { QuestionButtonsComponent } from './components/question-buttons/question-buttons.component';
import { QuestionsComponent } from './components/question-block/question-block.component';
import { DefaultButtonComponent } from './components/default-button/default-button.component';

import { BlockInjectorService } from './providers/block-injector.service';



@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ReactiveFormsModule,

    ConvlPageModule],

    declarations: [BlockComponent, MessageBlockComponent, QuestionButtonsComponent, QuestionsComponent, DefaultButtonComponent],

    // Injector which creates all block types within the editor context.
    providers: [BlockInjectorService],
})
export class BlocksLibraryModule {}
