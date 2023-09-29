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

import { MatSelectFilterModule } from 'mat-select-filter';

import { AccessControlModule } from '@app/private/elements/convs-mgr/access-control';

import { PermissionsComponent } from './components/permissions/permissions.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { ChatsSettingsComponent } from './components/chats-settings/chats-settings.component';

import { BotsSettingsComponent } from './components/bots-settings/bots-settings.component';
import { AssessmentSettingsComponent } from './components/assessment-settings/assessment-settings.component';
import { AnalyticsSettingsComponent } from './components/analytics-settings/analytics-settings.component';
import { LearnerSettingsComponent } from './components/learner-settings/learner-settings.component';

import { DeleteOrgRoleModalComponent } from './modals/delete-org-role-modal/delete-org-role-modal.component';
import { AddNewOrgRoleModalComponent } from './modals/add-new-org-role-modal/add-new-org-role-modal.component';

import { PermissionsModelService } from './services/permissions.service';
import { PermissionsFormsService } from './services/permissions-forms.service';
import { SwitchButtonComponent } from './modals/switch-button/switch-button.component';

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

    AccessControlModule,
  ],
  declarations: [
    PermissionsComponent,

    GeneralSettingsComponent,
    ChatsSettingsComponent,
    BotsSettingsComponent,
    AnalyticsSettingsComponent,
    AssessmentSettingsComponent,
    LearnerSettingsComponent,

    AddNewOrgRoleModalComponent,
    DeleteOrgRoleModalComponent,
    SwitchButtonComponent,
  ],
  exports: [
    PermissionsComponent,
    AddNewOrgRoleModalComponent,
    DeleteOrgRoleModalComponent,
  ],
  providers: [PermissionsModelService, PermissionsFormsService],
})
export class PermissionsSettingsModule {}
