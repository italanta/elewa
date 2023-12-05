import { Component, Input } from '@angular/core';
import { ItalBreadCrumb } from '@app/model/layout/ital-breadcrumb';

@Component({
  selector: 'app-ital-breadcrumb',
  templateUrl: './ital-breadcrumb.component.html',
  styleUrls: ['./ital-breadcrumb.component.scss'],
})
export class ItalBreadcrumbComponent {
  @Input()
  public breadcrumb: ItalBreadCrumb = {
    icon: '',
    paths: [],
};
}
