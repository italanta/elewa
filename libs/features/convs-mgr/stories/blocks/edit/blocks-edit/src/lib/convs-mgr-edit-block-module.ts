import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageBlockEditComponent } from './components/message-block-edit/message-block-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  declarations: [MessageBlockEditComponent],
})
export class ConvsMgrEditBlockModule {}
