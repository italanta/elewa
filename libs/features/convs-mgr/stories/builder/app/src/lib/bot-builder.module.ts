import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';

import { BotBuilderPageComponent } from './pages/bot-builder/bot-builder.page';
import { BotBuilderRouterModule } from './bot-builder.router.module';


@NgModule({
  imports: [
    CommonModule, MultiLangModule,
    ItalBreadCrumbModule,
    BotBuilderRouterModule,
  ],

  declarations: [
    BotBuilderPageComponent
  ],

  providers: [ 
    
  ],
})
export class BotBuilderBaseModule { }
