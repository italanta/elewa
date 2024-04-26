import { FormBuilder } from '@angular/forms';

export function initFallBackFormGroup(_fb: FormBuilder, fallbackForm: any) {
  return _fb.group({
    id: ['' ?? fallbackForm.id],
    userSays: ['' ?? fallbackForm.userSays],
    actions: ['' ?? fallbackForm.actions],
    actionDelays: ['' ?? fallbackForm.actionDelays],
  });
}