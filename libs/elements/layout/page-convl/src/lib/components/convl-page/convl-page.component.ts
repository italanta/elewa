import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

import { Intercom } from 'ng-intercom';

import { Breadcrumb } from '@iote/bricks-angular';

import { ConlvSideNavContainerComponent } from '../convl-sidenav-container/nav-wrapper.component';

@Component({
  selector: 'convl-page',
  templateUrl: './convl-page.component.html',
  styleUrls: [ './convl-page.component.scss' ]
})
export class ConvlPageComponent implements OnInit
{
  @Input() loading = false;
  @Input() backButton = false;
  @Input() breadcrumbs: Breadcrumb[];
  @Input() nomarg = false;
  @Input() noside = false;
  @Input() title: string;
  isMenuOpen = true

  @ViewChild('page') page: ElementRef;

  @ViewChild(ConlvSideNavContainerComponent) sidnav: ConlvSideNavContainerComponent;

  constructor(public intercom: Intercom) {}

  ngOnInit() {
    this.intercom.boot({
      app_id: 'jvwszj2k',
      // Supports all optional configuration.
      widget: {
        "activator": "#intercom" 
      }
    });
  }
  
  setMenuStatus($event: boolean) {
    this.isMenuOpen = $event
  }
}
