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

// import { MatSelectFilterModule } from 'mat-select-filter';

// import { AccessControlModule } from '@app/elements/access-control';

// import { PermissionsComponent } from './components/permissions/permissions.component';
// import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
// import { CompanySettingsComponent } from './components/company-settings/company-settings.component';
// import { ContactSettingsComponent } from './components/contact-settings/contact-settings.component';
// import { OpportunitiesSettingsComponent } from './components/opportunities-settings/opportunities-settings.component';
// import { InvoicesSettingsComponent } from './components/invoices-settings/invoices-settings.component';

// import { DeleteOrgRoleModalComponent } from './modals/delete-org-role-modal/delete-org-role-modal.component';
// import { AddNewOrgRoleModalComponent } from './modals/add-new-org-role-modal/add-new-org-role-modal.component';
// import { PermissionsModelService } from './services/permissions.service';
// import { PermissionsFormsService } from './services/permissions-forms.service';
// import { AccountsSettingsComponent } from './components/accounts-settings/accounts-settings.component';
// import { PaymentsSettingsComponent } from './components/payments-settings/payments-settings.component';
// import { ExpensesSettingsComponent } from './components/expenses-settings/expenses-settings.component';
// import { BudgetsSettingsComponent } from './components/budgets-settings/budgets-settings.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    // MatSelectFilterModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,

    // AccessControlModule,
  ],
  declarations: [
    // PermissionsComponent,
    // GeneralSettingsComponent,
    // CompanySettingsComponent,
    // ContactSettingsComponent,
    // OpportunitiesSettingsComponent,
    // InvoicesSettingsComponent,

    // AddNewOrgRoleModalComponent,
    // DeleteOrgRoleModalComponent,
    // AccountsSettingsComponent,
    // PaymentsSettingsComponent,
    // ExpensesSettingsComponent,
    // BudgetsSettingsComponent,
  ],
  exports: [
    // PermissionsComponent,
    // AddNewOrgRoleModalComponent,
    // DeleteOrgRoleModalComponent,
  ],
  providers: [
    // PermissionsModelService, 
    // PermissionsFormsService
  ],
})
export class PermissionsSettingsModule {}
