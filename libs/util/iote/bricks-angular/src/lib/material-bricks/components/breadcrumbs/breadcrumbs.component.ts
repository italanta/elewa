import { Component, Input } from '@angular/core';
                      // Dependency right into an external module. Could be solved more elegantly.
import { Breadcrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent
{
  @Input() breadcrumbs: Breadcrumb[];
}
