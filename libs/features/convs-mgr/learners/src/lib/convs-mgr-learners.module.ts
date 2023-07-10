import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnersPageComponent } from './pages/learners-page/learners-page.component';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

@NgModule({
  imports: [CommonModule, ConvlPageModule],
  declarations: [LearnersPageComponent],
})
export class ConvsMgrLearnersModule {}
