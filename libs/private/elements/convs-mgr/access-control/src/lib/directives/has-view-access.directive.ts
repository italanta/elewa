import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccessRights, AppClaimDomains } from '@app/model/access-control';

import { IAccessControlService } from '@app/state/access-control';
import { filter, take } from 'rxjs/operators';

@Directive({
  selector: '[hasViewAccess]'
})
export class HasViewAccessDirective
{
  isRendered = false;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              @Inject('IAccessControlService') private _permissionsStore: IAccessControlService)
  {}

  @Input() set hasViewAccess(claim: AppClaimDomains)
  {
    this._permissionsStore.getRights(claim)
          .pipe(
            take(1),
                filter(x => !!x))
          .subscribe(right => {this._render(right)});
  }

  private _render(right: AccessRights)
  {
    if(right === AccessRights.View && !this.isRendered)
    {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isRendered = true;
    }
    else {
      this.viewContainer.clear();
      this.isRendered = false;
    }
  }
}