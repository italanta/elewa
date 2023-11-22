import { Directive, ElementRef, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagsService } from '../service/feature-flags.service';

@Directive({
  selector: '[appFeatureFlag]'
})
export class FeatureFlagDirectiveDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private el: ElementRef,
    private featureFlagService: FeatureFlagsService
  ) {}

  @Input() set appFeatureFlag(featureName: string) {
    if (this.featureFlagService.isFeatureOn(featureName)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
      this.renderer.addClass(this.el.nativeElement, 'grayed-out-feature');
    }
  }
 }