import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
 
import { UserMenuModule } from '@app/elements/layout/user-menu';

import { PageComponent }             from './components/app-page/page.component';
import { NavbarComponent }           from './components/app-navbar/navbar.component';
import { NavbarSideComponent }       from './components/app-navbar-side/navbar-side.component';

import { SideNavContainerComponent } from './components/sidenav-container/nav-wrapper.component';
import { SideMenuFooterComponent }   from './components/sidemenu-footer/sidemenu-footer.component';
import { SubNavBarComponent }        from './components/sub-bar/sub-navbar.component';

// IMPORTANT - CONVL specific components.
import { ConvlSideMenuComponent }         from './components/convl-sidemenu/convl-sidemenu.component';

/**
 *  Conversational Learning Page Module. Holds the page holder.
 *      - CONVL project specific
 * 
 * @important ! 
 * - Is called the same as the base ital-page module. We use angular build configuration to replace the ital-page module 
 *    with this module on run- and compile time. This trick allows us to have multiple variants of the same module within a multi-app 
 *    setting.
 */
@NgModule({
  imports: [CommonModule,  RouterModule,
            MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
            UserMenuModule],

  declarations: [PageComponent, NavbarSideComponent, ConvlSideMenuComponent, NavbarComponent,
                 SideNavContainerComponent,
                 SideMenuFooterComponent, SubNavBarComponent,],

  providers: [],
  exports: [PageComponent, NavbarComponent],
})
export class iTalPageModule { }
