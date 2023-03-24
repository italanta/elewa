import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { TextMessageComponent } from './components/text-message/text-message.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule],
  declarations: [TextMessageComponent],
  exports: [TextMessageComponent],
})
export class ConvsMgrReusableTextAreaModule {}
