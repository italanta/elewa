import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { LocationBlockComponent } from './components/location-block/location-block.component';
import { LocationBlockMapComponent } from './components/location-block-map/location-block-map.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  imports: [
    CommonModule,
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
