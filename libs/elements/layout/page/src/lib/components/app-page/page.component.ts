import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Breadcrumb } from '@iote/bricks-angular';

import { SideNavContainerComponent } from '../sidenav-container/nav-wrapper.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: [ './page.component.scss' ]
})
export class PageComponent
{
  @Input() loading = false;
  @Input() backButton = false;
  @Input() breadcrumbs: Breadcrumb[];
  @Input() nomarg = false;
  @Input() noside = false;
  @Input() title: string;

  @ViewChild('page') page: ElementRef;

  @ViewChild(SideNavContainerComponent) sidnav: SideNavContainerComponent;

  toggleSideNav()
  {
    this.sidnav.toggleSidemenu();
  }
}
