import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
} from '@iote/bricks-angular';

import { UserMenuModule } from '@app/elements/layout/user-menu';

import { PageComponent } from './components/app-page/page.component';
import { NavbarComponent } from './components/app-navbar/navbar.component';
import { NavbarSideComponent } from './components/app-navbar-side/navbar-side.component';

import { SideNavContainerComponent } from './components/sidenav-container/nav-wrapper.component';
import { SideMenuFooterComponent } from './components/sidemenu-footer/sidemenu-footer.component';
import { SideMenuComponent } from './components/sidemenu/sidemenu.component';


/**
 *  Elewa Page Module. Shows an overview of the page.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    UserMenuModule,
  ],

  declarations: [
    PageComponent,
    NavbarSideComponent,
    SideMenuComponent,
    NavbarComponent,
    SideNavContainerComponent,
    SideMenuFooterComponent,
  ],

  providers: [],
  exports: [PageComponent, NavbarComponent],
})
export class iTalPageModule {}
