import { Component, Input } from '@angular/core';
import { BreadCrumbPath, ItalBreadCrumb } from '@app/model/layout/ital-breadcrumb';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ital-breadcrumb',
  templateUrl: './ital-breadcrumb.component.html',
  styleUrls: ['./ital-breadcrumb.component.scss'],
})
export class ItalBreadcrumbComponent {
  @Input() breadcrumbs$: Observable<BreadCrumbPath[]>;
  @Input() icon: string;
}
