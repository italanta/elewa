import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';

import { StoryBuilderNavBarComponent } from './builder-nav-bar/builder-nav-bar.component';

@NgModule({
  imports: [
    CommonModule, MultiLangModule,
    ItalBreadCrumbModule,
    FlexLayoutModule, 
    MaterialBricksModule, MaterialDesignModule, MaterialFormBricksModule,
    ItalBreadCrumbModule
  ],

  declarations: [StoryBuilderNavBarComponent],
  exports: [StoryBuilderNavBarComponent]
})
export class BuilderNavbarModule { }
