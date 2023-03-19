// text-message.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { TextMessageComponent } from './text-message.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialDesignModule,
  ],
  declarations: [TextMessageComponent],
  exports: [TextMessageComponent],
})
export class TextMessageModule {}
