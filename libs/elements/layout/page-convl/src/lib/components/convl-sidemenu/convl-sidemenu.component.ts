import { Component, Inject, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

import { SubSink } from 'subsink';

/**
 * Sidemenu component for the CONVERSATIONAL LEARNING project. 
 * @see convl-page.module to learn more about how we determine usage of this component.
 */
@Component({
  selector: 'convl-sidemenu',
  templateUrl: './convl-sidemenu.component.html',
  styleUrls: [ './convl-sidemenu.component.scss' ]
})
export class ConvlSideMenuComponent implements OnInit, OnDestroy
{
  private _sbS = new SubSink();

  @Input() user: any;
  @Output() toggleMenu:EventEmitter<any> = new EventEmitter()

  projectName: string;
  projectInfo: string;


  constructor(// private _org$$: ActiveOrgStore,
              // private _flow$$: ActiveCommFlowStore,
              @Inject('ENVIRONMENT') private _env: any)
  {}

  ngOnInit()
  {
    this.projectName = this._env.project.name;
    this.projectInfo = this._env.project.info;
  }

  getLogo = () => 'assets/images/italanta-logo.png'

  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }

}
