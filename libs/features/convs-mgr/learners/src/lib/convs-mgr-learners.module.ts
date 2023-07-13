import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { LearnersPageComponent } from './pages/learners-page/learners-page.component';

import { LearnersRouterModule } from './learners.router';

@NgModule({
  imports: [CommonModule, ConvlPageModule, LearnersRouterModule],
  declarations: [LearnersPageComponent],
})
export class ConvsMgrLearnersModule {}
