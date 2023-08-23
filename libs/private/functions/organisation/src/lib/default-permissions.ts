export const defaultPermissions = {
  GeneralSettings: {
    CanAddNewMember: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanDeleteMember: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanEditMember: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanViewSettings: { Admin: true, Viewer: false, ContentDeveloper: false },
  },
  BotsSettings: {
    CanViewBots: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanCreateBots: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanEditBots: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanDeleteBots: { Admin: true, Viewer: false, ContentDeveloper: false },
  },
  LearnersSettings: {
    CanViewLearners: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanCreateLearners: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanEditLearners: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanDeleteLearners: { Admin: true, Viewer: false, ContentDeveloper: false },
  },
  AssessmentsSettings: {
    CanViewAssessments: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanCreateAssessments: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanEditAssessments: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanDeleteAssessments: { Admin: true, Viewer: false, ContentDeveloper: false },
  },
  ChatsSettings: {
    CanViewChats: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanManageChats: { Admin: true, Viewer: false, ContentDeveloper: false },
  },
  AnalyticsSettings: {
    CanViewAnalytics: { Admin: true, Viewer: false, ContentDeveloper: false },
    CanManageAnalytics: { Admin: true, Viewer: false, ContentDeveloper: false },
  }
}