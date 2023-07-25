
import { IObject } from "@iote/bricks"

import { iTalUserRoles } from "@app/model/user"

export interface CLMPermissions extends IObject
{
  access: boolean,

  GeneralSettings: {
    CanAddNewMember: CLMFeaturePermission,
    CanEditMember: CLMFeaturePermission,
    CanDeleteMember: CLMFeaturePermission,
  },
  CompanySettings: {
    CanViewCompanies: CLMFeaturePermission,
    CanCreateCompanies: CLMFeaturePermission,
    CanEditCompanies: CLMFeaturePermission,
    CanDeleteCompanies: CLMFeaturePermission
  },
  LearnerSettings: {
    CanViewLearners: CLMFeaturePermission,
    CanCreateLearners: CLMFeaturePermission,
    CanEditLearners: CLMFeaturePermission,
    CanDeleteLearners: CLMFeaturePermission
  },
  AssessmentSettings: {
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