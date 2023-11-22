import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagsService } from './service/feature-flags.service';
import { FeatureFlagDirectiveDirective } from './directive/feature-flag-directive.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [FeatureFlagDirectiveDirective],
  exports: [FeatureFlagDirectiveDirective],
  providers: [FeatureFlagsService],
})
export class ElementsBaseFeatureFlagsModule {}
