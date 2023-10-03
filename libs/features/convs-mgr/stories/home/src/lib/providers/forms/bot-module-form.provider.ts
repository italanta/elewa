import { FormBuilder, Validators } from '@angular/forms';
import { generateName } from '../util/generate-name';

export function CREATE_EMPTY_BOT_MODULE(_fb: FormBuilder) {
  return _fb.group({
    moduleName: [generateName(), Validators.required],
    moduleDesc: [''],
    parentBot: ['', Validators.required],
    stories: [[]],
  });
}
