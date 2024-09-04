import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiLangModule } from '@ngfi/multi-lang';

import {
  MaterialDesignModule,
  MaterialBricksModule,
} from '@iote/bricks-angular';

import { ConvsMgrProcessInputsModule } from '@app/features/convs-mgr/stories/blocks/process-inputs';
import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { ConvsMgrReusableTextAreaModule } from '@app/features/convs-mgr/stories/blocks/library/reusable-text-area';
import { ConvsMgrImageMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/image-message-block';
import { ConvsMgrLocationMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/location-message-block';
import { ConvsMgrDocumentMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/document-message-block';
import { ConvsMgrAudioMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/audio-message-block';
import { ConvsMgrVideoMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/video-message-block';
import { ConvsMgrConditionalBlockModule } from '@app/features/convs-mgr/stories/blocks/library/conditional-block';

import { QuestionButtonsEditFormsComponent } from './components/question-buttons-edit-forms/question-buttons-edit-forms.component';
import { LocationInputBlockEditComponent } from './components/location-input-block-edit/location-input-block-edit.component';
import { KeywordJumpBlockEditComponent } from './components/keyword-jump-block-edit/keyword-jump-block-edit.component';
import { OpenEndedQuestionEditComponent } from './components/open-ended-question-edit/open-ended-question-edit.component';
import { ImageInputBlockEditComponent } from './components/image-input-block-edit/image-input-block-edit.component';
import { VideoInputBlockEditComponent } from './components/video-input-block-edit/video-input-block-edit.component';
import { AudioInputBlockEditComponent } from './components/audio-input-block-edit/audio-input-block-edit.component';
import { AssessmentBrickEditComponent } from './components/assessment-brick-edit/assessment-brick-edit.component';
import { MessageBlockEditComponent } from './components/message-block-edit/message-block-edit.component';
import { EmailBlockEditComponent } from './components/email-block-edit/email-block-edit.component';
import { PhoneBlockEditComponent } from './components/phone-block-edit/phone-block-edit.component';
import { NameBlockEditComponent } from './components/name-block-edit/name-block-edit.component';
import { WebhookEditComponent } from './components/webhook-edit/webhook-edit.component';
import { DefaultComponent } from './components/default/default.component';
import { ListBlockEditComponent } from './components/list-block-edit/list-block-edit.component';
import { ImageOutputBlockEditComponent } from './components/image-output-block-edit/image-output-block-edit.component';
import { LocationOutputBlockEditComponent } from './components/location-output-block-edit/location-output-block-edit.component';
import { DocumentOutputBlockEditComponent } from './components/document-output-edit/document-output-block-edit.component';
import { AudioOutputBlockEditComponent } from './components/audio-output-block-edit/audio-output-block-edit.component';
import { VideoOutputBlockEditComponent } from './components/video-output-block-edit/video-output-block-edit.component';
import { ConditionalBlockEditComponent } from './components/conditional-block-edit/conditional-block-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiLangModule,
    ConvsMgrBlockOptionsModule,
    MaterialBricksModule,
    MaterialDesignModule,
    ConvsMgrProcessInputsModule,
    ConvsMgrBlockOptionsModule,
    ConvsMgrReusableTextAreaModule,
    ConvsMgrImageMessageBlockModule,
    ConvsMgrLocationMessageBlockModule,
    ConvsMgrDocumentMessageBlockModule,
    ConvsMgrAudioMessageBlockModule,
    ConvsMgrVideoMessageBlockModule,
    ConvsMgrConditionalBlockModule
  ],
  
  declarations: [
    QuestionButtonsEditFormsComponent,
    LocationInputBlockEditComponent,
    KeywordJumpBlockEditComponent,
    OpenEndedQuestionEditComponent,
    ImageInputBlockEditComponent,
    AudioInputBlockEditComponent,
    VideoInputBlockEditComponent,
    AssessmentBrickEditComponent,
    MessageBlockEditComponent,
    NameBlockEditComponent,
    EmailBlockEditComponent,
    PhoneBlockEditComponent,
    WebhookEditComponent,
    DefaultComponent,
    ListBlockEditComponent,
    ImageOutputBlockEditComponent,
    LocationOutputBlockEditComponent,
    DocumentOutputBlockEditComponent,
    AudioOutputBlockEditComponent,
    VideoOutputBlockEditComponent,
    ConditionalBlockEditComponent
  ],
})
export class ConvsMgrEditBlockModule {}
