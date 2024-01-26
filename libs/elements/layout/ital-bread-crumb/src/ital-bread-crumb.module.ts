import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ItalBreadcrumbComponent } from './lib/components/ital-bread-crumb/ital-breadcrumb.component';

@NgModule({
  declarations: [ItalBreadcrumbComponent],
  imports: [CommonModule, RouterModule],
  exports: [ItalBreadcrumbComponent],
})
export class ItalBreadCrumbModule {}
