import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ItalBreadcrumbComponent } from './components/ital-bread-crumb/ital-breadcrumb.component';
import { StoryBreadcrumbComponent } from './components/story-breadcrumb/story-breadcrumb.component';

@NgModule({
  declarations: [ItalBreadcrumbComponent, StoryBreadcrumbComponent],
  imports: [CommonModule, RouterModule],
  exports: [ItalBreadcrumbComponent, StoryBreadcrumbComponent],
})
export class ItalBreadCrumbModule {}
