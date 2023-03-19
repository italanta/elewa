import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TextMessageComponent } from './components/text-message-block/text-message.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [TextMessageComponent],
  exports: [TextMessageComponent]
})
export class ConvsMgrReusableTextAreaModule {}
