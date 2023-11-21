import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appFeatureFlagDirective]'
})
export class FeatureFlagDirectiveDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  @Input() set appFeatureFlag(featureName: string) {
    if (this.featureFlagService.isFeatureOn(featureName)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
 }