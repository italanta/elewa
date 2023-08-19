import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccessRights, AppClaimDomains } from '@app/private/model/access-control';

import { filter, take } from 'rxjs/operators';

import { IAccessControlService } from '@app/private/state/access-control';

@Directive({
  selector: '[hasReadAccess]'
})
export class HasReadAccessDirective
{
  isRendered = false;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              @Inject('IAccessControlService') private _permissionsStore: IAccessControlService)
  {}

  @Input() set hasReadAccess(claim: AppClaimDomains)
  {
    this._permissionsStore.getRights(claim)
          .pipe(
            take(1),
                filter(x => !!x))
          .subscribe(right => {this._render(right)});
  }

  private _render(right: AccessRights)
  {
    if(right === AccessRights.Read && !this.isRendered)
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