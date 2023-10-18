import { FormBuilder } from '@angular/forms';
import { generateName } from '../util/generate-name';

export function CREATE_EMPTY_BOT(_fb: FormBuilder) {
  return _fb.group({
    botName: [generateName()],
    botDesc: [''],
    botImage: [''],
    modules: [[]],
  });
}
