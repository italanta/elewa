import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextMessageComponent } from './text-message.component';



@NgModule({
  declarations: [TextMessageComponent],
  imports: [
    CommonModule
  ],

  exports: [TextMessageComponent],
})
export class TextMessageModule { }
