import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AccessRights, AppClaimDomains } from '@app/private/model/access-control';

import { PerformActionRightsQuery } from '../queries/base/perfom-action-rights.query';
import { PerformAdminActionRightsQuery } from '../queries/base/perfom-admin-actions-rights.query';
import { PerformSuperAdminActionRightsQuery } from '../queries/base/perfom-super-admin-actions-rights.query';

import { PerformCreateClmMembersActionRightsQuery } from '../queries/base/perfom-create-clm-member-actions.query';

import { PerformBotsActionsViewRightsQuery } from '../queries/bots/perfom-bots-actions-view-rights.query';
import { PerformCreateBotsActionRightsQuery } from '../queries/bots/perfom-create-bots-actions-rights.query';
import { PerformDeleteBotsActionRightsQuery } from '../queries/bots/perfom-delete-bots-actions-rights.query';
import { PerformEditBotsActionRightsQuery } from '../queries/bots/perfom-edit-bots-actions-rights.query';

import { PerformViewLearnersActionRightsQuery } from '../queries/learners/perfom-view-learners-actions-rights.query';
import { PerformCreateLearnersActionRightsQuery } from '../queries/learners/perfom-create-learners-actions-rights.query';
import { PerformDeleteLearnersActionRightsQuery } from '../queries/learners/perfom-delete-learners-actions-rights.query';
import { PerformEditLearnersActionRightsQuery } from '../queries/learners/perfom-edit-learners-actions-rights.query';

import { PerformViewAssessmentsActionRightsQuery } from '../queries/assessments/perfom-view-assessments-actions-rights.query';
import { PerformCreateAssessmentsActionRightsQuery } from '../queries/assessments/perfom-create-assessments-actions-rights.query';
import { PerformDeleteAssessmentsActionRightsQuery } from '../queries/assessments/perfom-delete-assessments-actions-rights.query';
import { PerformEditAssessmentsActionRightsQuery } from '../queries/assessments/perfom-edit-assessments-actions-rights.query';

import { PerformViewChatsActionRightsQuery } from '../queries/chats/perfom-view-chats-actions-rights.query';
import { PerformManageChatsActionRightsQuery } from '../queries/chats/perfom-manage-chats-actions-rights.query';

import { PerformViewAnalyticsActionRightsQuery } from '../queries/analytics/perfom-view-analytics-actions-rights.query';
import { PerformManageAnalyticsActionRightsQuery } from '../queries/analytics/perfom-manage-analytics-actions-rights.query';

import { PerformSettingsActionRightsQuery } from '../queries/settings/perfom-settings-actions-rights.query';

import { IAccessControlService } from './access-control-service.interface';

@Injectable({
  providedIn: 'root',
})
export class AccessControlMainService implements IAccessControlService {

  constructor(// base actions access
    private _baseActionAccess: PerformActionRightsQuery,
    private _createMembersActionsAccess: PerformCreateClmMembersActionRightsQuery,
    private _adminActionAccess: PerformAdminActionRightsQuery,
    private _superAdminActionAccess: PerformSuperAdminActionRightsQuery,

    //bots actions rights
    private _viewBotsActionsAccess: PerformBotsActionsViewRightsQuery,
    private _createBotsActionAccess: PerformCreateBotsActionRightsQuery,
    private _deleteBotsActionsAccess: PerformDeleteBotsActionRightsQuery,
    private _editBotsActionsAccess: PerformEditBotsActionRightsQuery,

    //learners actions rights
    private _learnersActionsAccess: PerformViewLearnersActionRightsQuery,
    private _createLearnersActionsAccess: PerformCreateLearnersActionRightsQuery,
    private _deleteLearnersActionsAccess: PerformDeleteLearnersActionRightsQuery,
    private _editLearnersActionsAccess: PerformEditLearnersActionRightsQuery,

    // assessments actions rights
    private _assessmentsActionsAccess: PerformViewAssessmentsActionRightsQuery,
    private _createAssessmentsActionsAccess: PerformCreateAssessmentsActionRightsQuery,
    private _deleteAssessmentsActionsAccess: PerformDeleteAssessmentsActionRightsQuery,
    private _editAssessmentsActionsAccess: PerformEditAssessmentsActionRightsQuery,

    // chats actions access
    private _viewChatsActionsAccess: PerformViewChatsActionRightsQuery,
    private _manageChatsActionsAccess: PerformManageChatsActionRightsQuery,

    // analytics actions access
    private _viewAnalyticsActionsAccess: PerformViewAnalyticsActionRightsQuery,
    private _manageAnalyticsActionsAccess: PerformManageAnalyticsActionRightsQuery,

    //settings actions access
    private _settingsActionsAccess: PerformSettingsActionRightsQuery
  ) { }

  getRights(claim: AppClaimDomains): Observable<AccessRights> {

    switch (claim) {
      //clm admin claims
      case AppClaimDomains.superAdmin:
        return this._superAdminActionAccess.getRights();

      case AppClaimDomains.Admin:
        return this._adminActionAccess.getRights();

      //clm domain claims
      case AppClaimDomains.CanAddMembers:
        return this._createMembersActionsAccess.getRights();

      case AppClaimDomains.BotsView:
        return this._viewBotsActionsAccess.getRights();

      case AppClaimDomains.BotsCreate:
        return this._createBotsActionAccess.getRights();

      case AppClaimDomains.BotsEdit:
        return this._editBotsActionsAccess.getRights();

      case AppClaimDomains.BotsDelete:
        return this._deleteBotsActionsAccess.getRights();

      case AppClaimDomains.LearnersView:
        return this._learnersActionsAccess.getRights();

      case AppClaimDomains.LearnersEdit:
        return this._editLearnersActionsAccess.getRights();

      case AppClaimDomains.LearnersCreate:
        return this._createLearnersActionsAccess.getRights();

      case AppClaimDomains.LearnersDelete:
        return this._deleteLearnersActionsAccess.getRights();

      case AppClaimDomains.AssessmentsView:
        return this._assessmentsActionsAccess.getRights();

      case AppClaimDomains.AssessmentsEdit:
        return this._editAssessmentsActionsAccess.getRights();

      case AppClaimDomains.AssessmentsCreate:
        return this._createAssessmentsActionsAccess.getRights();

      case AppClaimDomains.AssessmentsDelete:
        return this._deleteAssessmentsActionsAccess.getRights();

      case AppClaimDomains.ChatsView:
        return this._viewChatsActionsAccess.getRights();

      case AppClaimDomains.ChatsManage:
        return this._manageChatsActionsAccess.getRights();

      case AppClaimDomains.AnalyticsView:
        return this._viewAnalyticsActionsAccess.getRights();

      case AppClaimDomains.AnalyticsManage:
        return this._manageAnalyticsActionsAccess.getRights();

      case AppClaimDomains.SettingsView:
        return this._settingsActionsAccess.getRights();

      default:
        return this._baseActionAccess.getRights();
    }
  }
}
