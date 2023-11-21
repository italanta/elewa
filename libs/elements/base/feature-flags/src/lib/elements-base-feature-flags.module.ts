import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagDirectiveDirective } from './directive/feature-flag-directive.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FeatureFlagDirectiveDirective
  ],
})
export class ElementsBaseFeatureFlagsModule {}
