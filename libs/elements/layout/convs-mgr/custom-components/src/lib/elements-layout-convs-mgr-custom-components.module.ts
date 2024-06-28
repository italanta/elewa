import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnOffButtonComponent } from './components/on-off-button/on-off-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ OnOffButtonComponent,
  ],
  exports: [ OnOffButtonComponent,
  ]
})
export class CustomComponentsModule {}
