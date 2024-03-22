import { FormBuilder } from '@angular/forms';

export function __CreatePermissionsMainForm(_fb: FormBuilder) {
  return _fb.group(
    {
      GeneralSettings: _fb.group({
        CanAddNewMember: _fb.group({}),
        CanDeleteMember: _fb.group({}),
        CanEditMember: _fb.group({}),
        CanViewSettings: _fb.group({}),
      }),
      BotsSettings: _fb.group({
        CanViewBots: _fb.group({}),
        CanCreateBots: _fb.group({}),
        CanEditBots: _fb.group({}),
        CanDeleteBots: _fb.group({}),
      }),
      LearnersSettings: _fb.group({
        CanViewLearners: _fb.group({}),
        CanCreateLearners: _fb.group({}),
        CanEditLearners: _fb.group({}),
        CanDeleteLearners: _fb.group({}),
      }),
      AssessmentsSettings: _fb.group({
        CanViewAssessments: _fb.group({}),
        CanCreateAssessments: _fb.group({}),
        CanEditAssessments: _fb.group({}),
        CanDeleteAssessments: _fb.group({}),
      }),
      ChatsSettings:  _fb.group({
        CanViewChats: _fb.group({}),
        CanManageChats: _fb.group({}),
      }),
      AnalyticsSettings: _fb.group({
        CanViewAnalytics: _fb.group({}),
        CanManageAnalytics: _fb.group({}),
      })
    },{}
  );
}
