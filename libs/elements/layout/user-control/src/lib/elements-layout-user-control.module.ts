import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUserMenuComponent } from './components/app-user-menu/app-user-menu.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { AppLogoutComponent } from './components/app-logout/app-logout.component';

@NgModule({
  imports: [CommonModule, MatMenuModule],
  declarations: [AppUserMenuComponent, AppLogoutComponent],
  providers: [],
  exports: [AppUserMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ElementsLayoutUserControlModule {}
