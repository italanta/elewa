import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { customTextValidator } from '../utils/validator';
import { MessageTemplate, TextHeader } from '@app/model/convs-mgr/functions';

export function createTemplateForm(fb: FormBuilder, template?: MessageTemplate): FormGroup {
  return fb.group({
    name: [template?.name ?? '', [Validators.required, Validators.pattern(/^[a-z0-9_-]{1,512}$/), customTextValidator]],
    category: [template?.category ?? '', Validators.required],
    channelId: [template?.channelId ?? '', Validators.required],
    language: [template?.language ?? '', Validators.required],
    id: [template?.id ?? ''],
    templateId: [template?.templateId ?? ''],
    headerExamples: fb.array([]),
    bodyExamples: fb.array([]),
    content: fb.group({
      header: fb.group({
        type: "TEXT",
        text: [(template?.content?.header as TextHeader)?.text ?? '',  Validators.required],
      }),
      body: fb.group({
        text: [template?.content?.body?.text ?? '', Validators.required],
      }),
      footer: [template?.content?.footer ?? ''],
    }),
    sent: [''],
    buttons: fb.array([]),
  });
}
