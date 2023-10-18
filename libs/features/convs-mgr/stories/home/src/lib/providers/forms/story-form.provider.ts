import { FormBuilder, Validators } from '@angular/forms';
import { generateName } from '../util/generate-name';

export function CREATE_EMPTY_STORY(_fb: FormBuilder) {
  return _fb.group({
    storyName: [generateName(), Validators.required],
    storyDesc: [''],
    parentModule: ['', Validators.required],
  });
}
