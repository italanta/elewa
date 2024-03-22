import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { HasWriteAccessDirective } from './directives/has-write-access.directive';
import { HasReadAccessDirective } from './directives/has-read-access.directive';
import { HasViewAccessDirective } from './directives/has-view-access.directive';
import { HasDeleteAccessDirective } from './directives/has-delete-access.directive';

import { NoPermissionToAccessComponent } from './components/no-permission-to-access/no-permission-to-access.component';

@NgModule({
  imports: [
    CommonModule,

    FlexLayoutModule,
    MaterialBricksModule,
    MaterialDesignModule,
  ],
  declarations: [
    HasWriteAccessDirective,
    HasReadAccessDirective,
    HasViewAccessDirective,
    HasDeleteAccessDirective,
    NoPermissionToAccessComponent,
  ],
  exports: [
    HasWriteAccessDirective,
    HasReadAccessDirective,
    HasViewAccessDirective,
    HasDeleteAccessDirective,
    NoPermissionToAccessComponent
  ],
})
export class AccessControlModule {}
