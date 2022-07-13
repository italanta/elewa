import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';

import { iTalPageModule } from '@app/elements/layout/page';

import { ConvsMgrHomeRouterModule } from './convs-mgr-home.router.module';
import { HomePageComponent } from './pages/home/home.page';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule,

    iTalPageModule,

    ConvsMgrHomeRouterModule],

    declarations: [HomePageComponent]
})
export class ConvsMgrHomeModule {}
