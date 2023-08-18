import { FormBuilder } from '@angular/forms';

export function __CreatePermissionsMainForm(_fb: FormBuilder) {
  return _fb.group(
    {
      GeneralSettings: _fb.group({
        CanAddNewMember: _fb.group({}),
        CanDeleteMember: _fb.group({}),
        CanEditMember: _fb.group({}),
      }),
      BotSettings: _fb.group({
        CanViewBots: _fb.group({}),
        CanCreateBots: _fb.group({}),
        CanEditBots: _fb.group({}),
        CanDeleteBots: _fb.group({}),
      }),
      LearnerSettings: _fb.group({
        CanViewLearners: _fb.group({}),
        CanCreateLearners: _fb.group({}),
        CanEditLearners: _fb.group({}),
        CanDeleteLearners: _fb.group({}),
      }),
      AssessmentSettings: _fb.group({
        CanViewAssessment: _fb.group({}),
        CanCreateAssessment: _fb.group({}),
        CanEditAssessment: _fb.group({}),
        CanDeleteAssessment: _fb.group({}),
      }),
      ChatsSettings:  _fb.group({
        CanViewChats: _fb.group({}),
        CanCreateChats: _fb.group({}),
        CanEditChats: _fb.group({}),
        CanDeleteChats: _fb.group({}),
      }),
      AnalyticsSettings: _fb.group({
        CanViewAnalytics: _fb.group({}),
        CanCreateAnalytics: _fb.group({}),
        CanEditAnalytics: _fb.group({}),
        CanDeleteAnalytics: _fb.group({}),
      })
    },{}
  );
}
