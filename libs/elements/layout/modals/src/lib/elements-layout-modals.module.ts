import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorPromptModalComponent } from './modals/error-prompt-modal/error-prompt-modal.component';

@NgModule({
  imports: [CommonModule, MatDialogModule],
  declarations: [ErrorPromptModalComponent],
})
export class ElementsLayoutModalsModule {}
