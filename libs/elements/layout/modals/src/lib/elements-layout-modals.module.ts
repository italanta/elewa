import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ErrorPromptModalComponent } from './error-prompt-modal/error-prompt-modal.component';


@NgModule({
  imports: [CommonModule, 
            MatDialogModule,
            FormsModule,
            ReactiveFormsModule,
            MultiLangModule,
          ],
  declarations: [ErrorPromptModalComponent,
  ],
})
export class ElementsLayoutModalsModule {}
