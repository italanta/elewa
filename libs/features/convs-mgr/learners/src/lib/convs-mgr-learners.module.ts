import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnersPageComponent } from './pages/learners-page/learners-page.component';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { LearnersRouterModule } from './learners.router';

@NgModule({
  imports: [CommonModule, ConvlPageModule, LearnersRouterModule],
  declarations: [LearnersPageComponent],
})
export class ConvsMgrLearnersModule {}
