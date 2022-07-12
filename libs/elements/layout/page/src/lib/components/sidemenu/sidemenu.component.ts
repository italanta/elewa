import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';

// import { ActiveOrgStore } from '@elewa/state/organisation';
// import { ActiveCommFlowStore } from '@elewa/state/comms/flows/main'

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: [ './sidemenu.component.scss' ]
})
export class SideMenuComponent implements OnInit, OnDestroy
{
  private _sbS = new SubSink();

  @Input() user: any;

  orgId:  string;
  flowId: string;

  constructor(// private _org$$: ActiveOrgStore,
              // private _flow$$: ActiveCommFlowStore,
              @Inject('ENVIRONMENT') private _env: any)
  {}

  ngOnInit()
  {
    this.orgId  = this._env.project.name;
    this.flowId = this._env.project.flows[0];
  }

  getLogo = () => 'assets/images/italanta-logo.png'

  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }
}
