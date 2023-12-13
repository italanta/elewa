import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { customTextValidator } from '../utils/validator';
import { MessageTemplate, TextHeader } from '@app/model/convs-mgr/functions';

export function createTemplateForm(fb: FormBuilder, template?: MessageTemplate): FormGroup {
  return fb.group({
    name: [template?.name ?? '', [Validators.required, Validators.pattern(/^[a-z0-9_-]{1,512}$/), customTextValidator]],
    category: [template?.category ?? '', Validators.required],
    channelId: [template?.channelId ?? '', Validators.required],
    language: [template?.language ?? '', Validators.required],
    content: fb.group({
      header: fb.group({
        type: "TEXT",
        text: [(template?.content?.header as TextHeader)?.text ?? '',  Validators.required],
        examples: fb.array([]),
      }),
      body: fb.group({
        text: [template?.content?.body?.text ?? '', Validators.required],
        examples: fb.array([]),
      }),
      footer: [template?.content?.footer ?? ''],
      templateId: [''],
      sent: [''],
    }),
    buttons: fb.array([]),
  });
}
