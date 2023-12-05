import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureFlagDirectiveDirective } from './directive/feature-flag.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [FeatureFlagDirectiveDirective],
  exports: [FeatureFlagDirectiveDirective],
})
export class FeatureFlagsModule {}
