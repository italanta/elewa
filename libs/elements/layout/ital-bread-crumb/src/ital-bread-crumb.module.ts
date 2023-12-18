import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ItalBreadcrumbComponent } from './lib/components/ital-bread-crumb/ital-breadcrumb.component';
import { BreadcrumbResolver } from './lib/resolvers/breadcrumb.resolver';



@NgModule({
  declarations: [ItalBreadcrumbComponent],
  imports: [CommonModule, RouterModule],
  exports: [ItalBreadcrumbComponent],
  providers: [BreadcrumbResolver],
})
export class ItalBreadCrumbModule {}
