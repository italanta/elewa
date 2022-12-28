import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { MaterialDesignModule } from '../material-design/material-design.module';
import { AutocompleteActionFieldComponent } from './components/autocomplete-action-field/autocomplete-action-field.component';
import { MultiAutocompleteActionFieldComponent } from './components/multi-autocomplete-action-field/multi-autocomplete-action-field.component';

/**
 * Base reusable form front end components and directives.
 *
 * @dependency Angular Material
 * @dependency Angular Forms
 */
@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialDesignModule,
    FormsModule
  ],

  declarations: [
    AutocompleteActionFieldComponent,
    MultiAutocompleteActionFieldComponent
  ],

  providers: [],

  exports: [
    AutocompleteActionFieldComponent,
    MultiAutocompleteActionFieldComponent
  ]
})
export class MaterialFormBricksModule {}
