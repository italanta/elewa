import { Component, OnInit } from '@angular/core';
import { Organisation } from '@app/model/organisation';
import { OrganisationService } from '@app/private/state/organisation/main';

@Component({
  selector: 'app-clm-micro-app-page',
  templateUrl: './clm-micro-app-page.component.html',
  styleUrls: ['./clm-micro-app-page.component.scss'],
})
export class ClmMicroAppPageComponent implements OnInit
{
  organization: Organisation;
  logoUrl = ''

  constructor(private _orgService$$: OrganisationService,) {}

  ngOnInit()
  {
    this._orgService$$.getActiveOrg().subscribe((org: Organisation) => {
      if (org) {
        this.organization = org;
        this.logoUrl = this.organization.logoUrl as string
        console.log(this.organization)
      }
    })
  }
}
