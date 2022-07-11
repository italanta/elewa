import { NgModule } from '@angular/core';

import { ScrollingModule, } from '@angular/cdk/scrolling';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule  } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule  } from '@angular/material/grid-list';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatRippleModule } from '@angular/material/core'
import { MatDividerModule } from '@angular/material/divider';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

// src= https://stackoverflow.com/questions/45166844/how-to-import-angular-material-in-project
// export function mapMaterialModules() {
//   return Object.keys(MATERIAL_MODULES).filter((k) => {
//     const asset = MATERIAL_MODULES[k];
//     return typeof asset === 'function'
//       && asset.name.startsWith('Mat')
//       && asset.name.includes('Module');
//   }).map((k) => MATERIAL_MODULES[k]);
// }
// const modules = mapMaterialModules();

/**
 * Module that imports all the modules we use from angular material.
 * We export these modules and import them back into the main application.
 *
 * Doing so, we make them available to the whole application.
 */
@NgModule({
    imports: [],
    exports: [ MatRippleModule, MatDatepickerModule,
               MatButtonModule, MatStepperModule, MatCheckboxModule, MatToolbarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule,
               MatCardModule, MatFormFieldModule, MatRadioModule, MatSelectModule, MatIconModule,
               MatTableModule, MatDialogModule, MatListModule, MatSnackBarModule, MatInputModule,
               MatSortModule, MatAutocompleteModule, MatTooltipModule, MatSliderModule, MatSlideToggleModule, MatTreeModule, MatExpansionModule, MatTabsModule,
               ScrollingModule, MatGridListModule, MatPaginatorModule, MatSidenavModule, MatButtonToggleModule, MatDividerModule,
               MatChipsModule, MatBottomSheetModule]
})
export class MaterialDesignModule { }
