import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { BreadCrumbPath, BreadCrumbImage } from '@app/model/layout/ital-breadcrumb';

@Component({
  selector: 'app-ital-breadcrumb',
  templateUrl: './ital-breadcrumb.component.html',
  styleUrls: ['./ital-breadcrumb.component.scss'],
})
export class ItalBreadcrumbComponent {
  @Input() breadcrumbs$: Observable<BreadCrumbPath[]>;

  constructor(private _router: Router) {};

  isStringLabel(label: string | BreadCrumbImage) {
    return typeof label === 'string';
  };

  isObjectLabel(label: string | BreadCrumbImage) {
    return typeof label === 'object';
  };

  navigateToRoute(route: string): void {
    this._router.navigate([route]);
  };

  getBreadcrumbImageSrc(breadcrumbLabel: string | BreadCrumbImage) {
    if (typeof breadcrumbLabel === 'object') return breadcrumbLabel.src;
    else return;
  };
}
