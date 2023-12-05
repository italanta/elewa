import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { UserMenuModule } from '@app/elements/layout/user-menu';
import { FeatureFlagsModule } from '@app/elements/base/feature-flags';
import { AccessControlModule } from '@app/private/elements/convs-mgr/access-control';


import { ConvlPageComponent } from './components/convl-page/convl-page.component';
import { ConvlSideMenuComponent } from './components/convl-sidemenu/convl-sidemenu.component';
import { SideMenuFooterComponent } from './components/convl-sidemenu-footer/sidemenu-footer.component';
import { ConlvSideNavContainerComponent } from './components/convl-sidenav-container/nav-wrapper.component';
import { SubNavBarComponent } from './components/sub-bar/sub-navbar.component';
import { ConvlNavbarComponent } from './components/convl-navbar/navbar.component';


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
  imports: [
    RouterModule,
    MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    UserMenuModule,
    FeatureFlagsModule,
    AccessControlModule,
    CommonModule
  ],

  declarations: [
    ConvlPageComponent, ConvlNavbarComponent, ConvlSideMenuComponent,
    SideMenuFooterComponent,
    ConlvSideNavContainerComponent, SubNavBarComponent
  ],

  providers: [],
  exports: [ConvlPageComponent],
})
export class ConvlPageModule { }
