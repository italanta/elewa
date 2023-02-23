import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextMessageComponent } from './components/text-message/text-message.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [TextMessageComponent],
  exports: [TextMessageComponent]

})
export class ConvsMgrTextMessageOptionsModule {}
