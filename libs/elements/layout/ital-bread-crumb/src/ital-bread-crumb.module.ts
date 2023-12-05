import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItalBreadcrumbComponent } from './lib/ital-bread-crumb/ital-breadcrumb.component';

@NgModule({
  declarations: [ItalBreadcrumbComponent],
  imports: [CommonModule],
  exports: [ItalBreadcrumbComponent],
})
export class ItalBreadCrumbModule {}
