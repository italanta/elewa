import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessControlMainService } from './services/access-control-main.service';

//base actions
import { PerformActionRightsQuery } from './queries/base/perfom-action-rights.query';
import { PerformAdminActionRightsQuery } from './queries/base/perfom-admin-actions-rights.query';
import { PerformSuperAdminActionRightsQuery } from './queries/base/perfom-super-admin-actions-rights.query';

//role actions
import { PerformSeniorActionRightsQuery } from './queries/base/perfom-senior-actions-rights.query';
import { PerformJuniorActionRightsQuery } from './queries/base/perfom-junior-actions-rights.query';
import { PerformInternActionRightsQuery } from './queries/base/perfom-intern-actions-rights.query';
import { PerformCreateClmMembersActionRightsQuery } from './queries/base/perfom-create-clm-member-actions.query';

//domain actions
//bots actions
import { PerformCreateBotsActionRightsQuery } from './queries/bots/perfom-create-bots-actions-rights.query';
import { PerformBotsActionsViewRightsQuery } from './queries/bots/perfom-bots-actions-view-rights.query';
import { PerformDeleteBotsActionRightsQuery } from './queries/bots/perfom-delete-bots-actions-rights.query';
import { PerformEditBotsActionRightsQuery } from './queries/bots/perfom-edit-bots-actions-rights.query';

//learners actions
import { PerformViewLearnersActionRightsQuery } from './queries/learners/perfom-view-learners-actions-rights.query';
import { PerformCreateLearnersActionRightsQuery } from './queries/learners/perfom-create-learners-actions-rights.query';
import { PerformDeleteLearnersActionRightsQuery } from './queries/learners/perfom-delete-learners-actions-rights.query';
import { PerformEditLearnersActionRightsQuery } from './queries/learners/perfom-edit-learners-actions-rights.query';

//assessments actions
import { PerformViewAssessmentsActionRightsQuery } from './queries/assessments/perfom-view-assessments-actions-rights.query';
import { PerformCreateAssessmentsActionRightsQuery } from './queries/assessments/perfom-create-assessments-actions-rights.query';
import { PerformDeleteAssessmentsActionRightsQuery } from './queries/assessments/perfom-delete-assessments-actions-rights.query';
import { PerformEditAssessmentsActionRightsQuery } from './queries/assessments/perfom-edit-assessments-actions-rights.query';

//analytics actions

import { PerformViewAnalyticsActionRightsQuery } from './queries/analytics/perfom-view-analytics-actions-rights.query';
import { PerformManageAnalyticsActionRightsQuery } from './queries/analytics/perfom-manage-analytics-actions-rights.query';

//chats actions
import { PerformViewChatsActionRightsQuery } from './queries/chats/perfom-view-chats-actions-rights.query';
import { PerformManageChatsActionRightsQuery } from './queries/chats/perfom-manage-chats-actions-rights.query';

// settings Actions
import { PerformSettingsActionRightsQuery } from './queries/settings/perfom-settings-actions-rights.query';

import { DataAccessQuery } from './base/data-access-query';
import { ActiveDomainLoader } from './base/base-domains/active-domain-loader.service';

@NgModule({
  imports: [CommonModule],
})
export class AccessControlStateModule {
  static forRoot(): ModuleWithProviders<AccessControlStateModule>
  {
    return {
      ngModule: AccessControlStateModule,
      providers: [

        //base data access control
        DataAccessQuery,
        ActiveDomainLoader,

        //members actions rights
        PerformCreateClmMembersActionRightsQuery,
        
        //base actions rights
        PerformActionRightsQuery,
        PerformAdminActionRightsQuery,
        PerformSuperAdminActionRightsQuery,

        //role actions
        PerformSeniorActionRightsQuery,
        PerformJuniorActionRightsQuery,
        PerformInternActionRightsQuery,

        PerformSettingsActionRightsQuery,

        //bots Actions Rights
        PerformCreateBotsActionRightsQuery,
        PerformBotsActionsViewRightsQuery,
        PerformDeleteBotsActionRightsQuery,
        PerformEditBotsActionRightsQuery,

        //learners Actions Rights
        PerformViewLearnersActionRightsQuery,
        PerformCreateLearnersActionRightsQuery,
        PerformDeleteLearnersActionRightsQuery,
        PerformEditLearnersActionRightsQuery,

        //analytics actions rights
        PerformViewAnalyticsActionRightsQuery,
        PerformManageAnalyticsActionRightsQuery,

        //chats actions
        PerformViewChatsActionRightsQuery,
        PerformManageChatsActionRightsQuery,

        //assessments actions rights
        PerformViewAssessmentsActionRightsQuery,
        PerformCreateAssessmentsActionRightsQuery,
        PerformDeleteAssessmentsActionRightsQuery,
        PerformEditAssessmentsActionRightsQuery,

        { provide: 'IAccessControlService', useClass: AccessControlMainService }
      ]
    }
  }
}
