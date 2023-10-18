import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { OrgsPagesComponent } from './pages/orgs-pages/orgs-pages.component';


const ORG_ROUTES: Route[] = [
  { path: '', component: OrgsPagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(ORG_ROUTES)],
  exports: [RouterModule]
})
export class OrganisationRouterModule { }