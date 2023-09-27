import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { OrgsPagesComponent } from './pages/orgs-pages/orgs-pages.component';

import { OrganisationRouterModule } from './organisation.router';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule, 
    MaterialBricksModule, 
    FlexLayoutModule,

    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,

    OrganisationRouterModule
  ],
  declarations: [
    OrgsPagesComponent
  ],
})
export class OrganisationModule {}