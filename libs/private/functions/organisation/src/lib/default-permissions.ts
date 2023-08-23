export const defaultPermissions =  {
  GeneralSettings: {
    CanAddNewMember: {admin:true, senior:false, junior:false, intern:false},
    CanDeleteMember: {admin:true, senior:false, junior:false, intern:false},
    CanEditMember: {admin:true, senior:false, junior:false, intern:false},
    CanViewSettings: {admin:true, senior:false, junior:false, intern:false},
  },
  BotsSettings: {
    CanViewBots: {admin:true, senior:false, junior:false, intern:false},
    CanCreateBots: {admin:true, senior:false, junior:false, intern:false},
    CanEditBots: {admin:true, senior:false, junior:false, intern:false},
    CanDeleteBots: {admin:true, senior:false, junior:false, intern:false},
  },
  LearnersSettings: {
    CanViewLearners: {admin:true, senior:false, junior:false, intern:false},
    CanCreateLearners: {admin:true, senior:false, junior:false, intern:false},
    CanEditLearners: {admin:true, senior:false, junior:false, intern:false},
    CanDeleteLearners: {admin:true, senior:false, junior:false, intern:false},
  },
  AssessmentsSettings: {
    CanViewAssessments: {admin:true, senior:false, junior:false, intern:false},
    CanCreateAssessments: {admin:true, senior:false, junior:false, intern:false},
    CanEditAssessments: {admin:true, senior:false, junior:false, intern:false},
    CanDeleteAssessments: {admin:true, senior:false, junior:false, intern:false},
  },
  ChatsSettings: {
    CanViewChats: {admin:true, senior:false, junior:false, intern:false},
    CanManageChats: {admin:true, senior:false, junior:false, intern:false},
  },
  AnalyticsSettings: {
    CanViewAnalytics: {admin:true, senior:false, junior:false, intern:false},
    CanManageAnalytics: {admin:true, senior:false, junior:false, intern:false},
  }
}