import { Component, Inject, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

import { SubSink } from 'subsink';
import { SidemenuToggleService } from '../../../../../../../services/sidemenu-toggle.service'
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
  @Output() menuToggled: EventEmitter<any> = new EventEmitter();
  
  getLogo = 'assets/images/italanta-logo.png';
  projectName: string;
  projectInfo: string;

  isExpanded:boolean;


  constructor(// private _org$$: ActiveOrgStore,
              // private _flow$$: ActiveCommFlowStore,
              private sideMenu:SidemenuToggleService,
              @Inject('ENVIRONMENT') private _env: any)
  {
    this.sideMenu.expand.subscribe(v=>this.isExpanded=v)
  }

  ngOnInit()
  {
    this.projectName = this._env.project.name;
    this.projectInfo = this._env.project.info;
    this.sideMenu.expand.subscribe(v=>this.isExpanded=v)
  }

  

  toggleMenu () {
    this.menuToggled.emit();
    this.sideMenu.expand.next(!this.isExpanded)
    
  }

  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }

}
