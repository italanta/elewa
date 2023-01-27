import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioInputMessageBlockComponent } from './audio-input-message-block/audio-input-message-block.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AudioInputMessageBlockComponent],
  exports: [AudioInputMessageBlockComponent],
})
export class ConvsMgrAudioInputBlockModule {}
