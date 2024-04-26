import { FormBuilder } from '@angular/forms';
import { Fallback } from '@app/model/convs-mgr/fallbacks';

export function initFallBackFormGroup(
  _fb: FormBuilder,
  fallbackForm: Fallback
) {
  return _fb.group({
    id: ['' ?? fallbackForm.id],
    userSays: ['' ?? fallbackForm.userSays],
    actions: ['' ?? fallbackForm.actions],
    actionDelays: ['' ?? fallbackForm.actionDelays],
  });
}
