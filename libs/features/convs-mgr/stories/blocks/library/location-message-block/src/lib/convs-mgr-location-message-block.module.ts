import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { GoogleMapsModule } from '@angular/google-maps';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { LocationBlockComponent } from './components/location-block/location-block.component';
import { LocationBlockMapComponent } from './components/location-block-map/location-block-map.component';

@NgModule({
  imports: [
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,

    ConvsMgrBlockOptionsModule,
  ],

  declarations: [LocationBlockComponent, LocationBlockMapComponent],

  exports: [LocationBlockComponent],
})
export class ConvsMgrLocationMessageBlockModule {}
