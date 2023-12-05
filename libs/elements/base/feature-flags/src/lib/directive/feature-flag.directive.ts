import { Directive, Input, ViewContainerRef, TemplateRef, OnInit, Renderer2 } from '@angular/core';

import { FeatureFlagsService } from '../service/feature-flags.service';


@Directive({
  selector: '[appFeatureFlag]'
})
export class FeatureFlagDirectiveDirective implements OnInit {
  @Input('appFeatureFlag') featureName:string;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private renderer: Renderer2, 
    private featureFlagsService: FeatureFlagsService // Inject the FeatureFlagsService
  ) {}

  ngOnInit() {
    // Check if the feature is on
    const isFeatureOn = this.featureFlagsService.isFeatureOn(this.featureName);

    // Create the embedded view
    const embeddedView = this.viewContainer.createEmbeddedView(this.templateRef);

    // Access the root nodes of the embedded view
    const rootNodes = embeddedView.rootNodes;

    // Check if there are root nodes (there should be at least one)
    if (rootNodes && rootNodes.length > 0) {
      const element = rootNodes[0] as HTMLElement;

       // Apply or remove a CSS class based on the feature status
       if (!isFeatureOn) {
        
          // Feature is off, add the CSS class and "Coming Soon" text
          this.renderer.addClass(element, 'feature-flag-off');
          this.renderer.setAttribute(element, 'disabled', 'true');
          this.renderer.setStyle(element, 'cursor', 'not-allowed'); // Optional: Change cursor style
      } else {
          // Feature is on, remove the CSS class and deactivate the link
        this.renderer.removeClass(element, 'feature-flag-off');
      }
    }
  }
}
