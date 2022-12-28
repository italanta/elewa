import { NgModule, ModuleWithProviders } from '@angular/core';

import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '../flex-layout/flex-layout.module';
import { MaterialDesignModule } from '../material-design/material-design.module';

import { NavbarComponent } from './components/navbar/navbar.component';
import { PageComponent } from './components/page/page.component';
import { FrameComponent } from './components/frame/frame.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { ActionTileComponent } from './components/action-tile/action-tile.component';
import { ActionModalComponent } from './components/action-modal/action-modal.component';
import { AppHighlightComponent } from './components/highlight-section/highlight-section.component';
import { ItemCardRowComponent } from './components/item-card-row/item-card-row.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ModuleCardComponent } from './components/module-card/module-card.component';
import { CalendarComponent } from './components/calendar/calendar.component';

import { ThemingService } from './services/theming.service';
import { ToastService } from "./services/toast.service";
import { DialogService } from "./services/dialog.service";

/**
 * Base reusable dumb front end components and directives.
 *
 * The components and directives in this module are dependent on Angular Material.
 */
@NgModule({
  imports: [MaterialDesignModule, FlexLayoutModule, RouterModule],

  declarations: [
    NavbarComponent,
    PageComponent,
    FrameComponent,
    SpinnerComponent,
    BreadcrumbsComponent,
    ActionTileComponent,
    AppHighlightComponent,
    ModuleCardComponent,

    ItemCardRowComponent,
    DataTableComponent,
    CalendarComponent,
    ActionModalComponent
  ],

  exports: [
    NavbarComponent,
    PageComponent,
    FrameComponent,
    SpinnerComponent,
    BreadcrumbsComponent,
    ActionTileComponent,
    ActionModalComponent,
    AppHighlightComponent,
    ModuleCardComponent,

    ItemCardRowComponent,
    DataTableComponent,
    CalendarComponent
  ]
})
export class MaterialBricksModule 
{ }

/*
* Base reusable dumb front end components and directives. FOR ROOT
*
* The components and directives in this module are dependent on Angular Material.
*/
@NgModule()
export class MaterialBricksRootModule 
{
  static forRoot(): ModuleWithProviders<MaterialBricksRootModule>
  {
    return {
      ngModule: MaterialBricksModule,
      providers: [
        ToastService,
        DialogService,
        ThemingService
      ]
    };
  }
}
