import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';

import { BotBuilderPageComponent } from './pages/bot-builder/bot-builder.page';
import { BotBuilderRouterModule } from './bot-builder.router.module';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { BuilderNavbarModule } from '@app/features/convs-mgr/stories/builder/nav';


@NgModule({
  imports: [
    CommonModule, MultiLangModule,
    ItalBreadCrumbModule,
    BotBuilderRouterModule,

    ConvlPageModule,
    BuilderNavbarModule
  ],

  declarations: [
    BotBuilderPageComponent
  ],

  providers: [ 
    
  ],
})
export class BotBuilderBaseModule { }
