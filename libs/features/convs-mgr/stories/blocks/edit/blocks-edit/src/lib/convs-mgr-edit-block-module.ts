import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageBlockEditComponent } from './components/message-block-edit/message-block-edit.component';
import { DefaultComponent } from './components/default/default.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  declarations: [
    MessageBlockEditComponent,
    DefaultComponent,
  ],
})
export class ConvsMgrEditBlockModule {}
