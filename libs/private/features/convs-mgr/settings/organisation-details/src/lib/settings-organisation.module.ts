import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
  MaterialFormBricksModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
// import { FileStorageService } from '@ngfi/files';

import { AccessControlModule } from '@app/private/elements/convs-mgr/access-control';

import { CompanyDataComponent } from './components/company-data/company-data.component';
import { UpdateCompanyLogoModalComponent } from './modals/update-company-logo-modal/update-company-logo-modal.component';
import { SelectChannelModalComponent } from './modals/select-channel-modal/select-channel-modal.component';
import { ChannelFormModalComponent } from './modals/channel-form-modal/channel-form-modal.component';
import { MainChannelModalComponent } from './modals/main-channel-modal/main-channel-modal.component';

import { PlatformPipe } from './pipes/platform.pipe';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,

    AccessControlModule,
  ],
  declarations: [
    CompanyDataComponent,
    UpdateCompanyLogoModalComponent,
    SelectChannelModalComponent,
    ChannelFormModalComponent,
    MainChannelModalComponent,
    PlatformPipe,
  ],
  exports: [CompanyDataComponent],
  providers: [
    // FileStorageService
  ],
})
export class SettingsOrganisationModule {}
