import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectFilterModule } from 'mat-select-filter';


import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
// import { FileStorageService } from '@ngfi/files';

import { AccessControlModule } from '@app/private/elements/convs-mgr/access-control';

import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { UpdateProfilePictureModalComponent } from './modals/update-profile-picture-modal/update-profile-picture-modal.component';

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
    ProfileDetailsComponent,
    UpdateProfilePictureModalComponent
  ],
  exports: [
    ProfileDetailsComponent
  ],
  providers: [
    // FileStorageService
  ]
})
export class SettingsProfileDetailsModule {}
