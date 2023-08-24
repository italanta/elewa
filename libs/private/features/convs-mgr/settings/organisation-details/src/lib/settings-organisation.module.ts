import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
// import { FileStorageService } from '@ngfi/files';

import { MatSelectFilterModule } from 'mat-select-filter';

import { AccessControlModule } from '@app/private/elements/convs-mgr/access-control';

import { CompanyDataComponent } from './components/company-data/company-data.component';
import { UpdateCompanyLogoModalComponent } from './components/update-company-logo-modal/update-company-logo-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MatSelectFilterModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,

    AccessControlModule
  ],
  declarations: [
    CompanyDataComponent,
    UpdateCompanyLogoModalComponent
  ],
  exports: [
    CompanyDataComponent
  ],
  providers: [
    // FileStorageService
  ]
})
export class SettingsOrganisationModule {}
