import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { customTextValidator } from '../utils/validator';

export function createEmptyTemplateForm(fb: FormBuilder): FormGroup {
  return fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]{1,512}$/), customTextValidator]],
    category: ['', Validators.required],
    channelId: ['', Validators.required],
    language: ['', Validators.required],
    content: fb.group({
      header: fb.group({
        type: "TEXT",
        text: ['',  Validators.required],
        examples: fb.array([]),
      }),
      body: fb.group({
        text: ['', Validators.required],
        examples: fb.array([]),
      }),
      footer: [''],
      templateId: [''],
      sent: [''],
    }),
    buttons: fb.array([]),
  });
}