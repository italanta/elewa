import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';

import { AppClaimDomains } from '@app/private/model/access-control';

import { SidemenuToggleService } from '../../providers/sidemenu-toggle.service'
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
  
  getLogo = 'assets/images/italanta-logo.png';
  projectName: string;
  projectInfo: string;

  isExpanded:boolean;

  readonly CAN_ACCESS_BOTS = AppClaimDomains.BotsView;
  readonly CAN_ACCESS_ANALYTICS = AppClaimDomains.AnalyticsView;
  readonly CAN_ACCESS_CHATS = AppClaimDomains.ChatsView;
  readonly CAN_ACCESS_LEARNERS = AppClaimDomains.LearnersView;
  readonly CAN_ACCESS_ASSESSMENTS = AppClaimDomains.AssessmentsView;
  readonly CAN_ACCESS_SETTINGS = AppClaimDomains.SettingsView;

  constructor(// private _org$$: ActiveOrgStore,
              // private _flow$$: ActiveCommFlowStore,
              private sideMenu:SidemenuToggleService,
              @Inject('ENVIRONMENT') private _env: any)
  {
    this._sbS.sink = this.sideMenu.menuStatus$.subscribe(
      (isOpen) => (this.isExpanded = isOpen)
    );
  }

  ngOnInit()
  {
    this.projectName = this._env.project.name;
    this.projectInfo = this._env.project.info;
  }

  

  toggleMenu () {
    this.sideMenu.toggleExpand(!this.isExpanded)
    
  }

  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }

}
