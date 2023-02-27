import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Breadcrumb } from '@iote/bricks-angular';

import { ConlvSideNavContainerComponent } from '../convl-sidenav-container/nav-wrapper.component';

@Component({
  selector: 'convl-page',
  templateUrl: './convl-page.component.html',
  styleUrls: [ './convl-page.component.scss' ]
})
export class ConvlPageComponent
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

  
  setMenuStatus($event: boolean) {
    this.isMenuOpen = $event
  }
}
