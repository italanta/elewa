
import { IObject } from "@iote/bricks"

import { iTalUserRoles } from "@app/model/user"

export interface CLMPermissions extends IObject
{
  access: boolean,

  GeneralSettings: {
    CanAddNewMember: CLMFeaturePermission,
    CanEditMember: CLMFeaturePermission,
    CanDeleteMember: CLMFeaturePermission,
    CanViewSettings: CLMFeaturePermission
  },
  BotsSettings: {
    CanViewBots: CLMFeaturePermission,
    CanCreateBots: CLMFeaturePermission,
    CanEditBots: CLMFeaturePermission,
    CanDeleteBots: CLMFeaturePermission
  },
  LearnersSettings: {
    CanViewLearners: CLMFeaturePermission,
    CanCreateLearners: CLMFeaturePermission,
    CanEditLearners: CLMFeaturePermission,
    CanDeleteLearners: CLMFeaturePermission
  },
  AssessmentsSettings: {
    CanViewAssessments: CLMFeaturePermission,
    CanCreateAssessments: CLMFeaturePermission,
    CanEditAssessments: CLMFeaturePermission,
    CanDeleteAssessments: CLMFeaturePermission
  },
  ChatsSettings: {
    CanViewChats: CLMFeaturePermission,
    CanManageChats: CLMFeaturePermission
  },
  AnalyticsSettings: {
    CanViewAnalytics: CLMFeaturePermission,
    CanManageAnalytics: CLMFeaturePermission
  }
}

/** Permission setting on a single feature/claim/.. */
export interface CLMFeaturePermission extends iTalUserRoles {}