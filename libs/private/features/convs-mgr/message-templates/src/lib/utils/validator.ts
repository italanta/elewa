import { FormControl } from '@angular/forms';

export function customTextValidator(control: FormControl) {
  const pattern = /^[a-z0-9_-]{1,512}$/;

  if (!pattern.test(control.value)) {
    return { invalidText: true };
  }

  return null;
}
