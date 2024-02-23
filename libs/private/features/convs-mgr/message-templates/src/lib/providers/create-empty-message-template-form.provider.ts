import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageTemplate, TextHeader, VariableExample } from '@app/model/convs-mgr/functions';

import { customTextValidator } from '../utils/validator';

export function createTemplateForm(fb: FormBuilder, template?: MessageTemplate): FormGroup {
  return fb.group({
    name: [template?.name ?? '', [Validators.required, Validators.pattern(/^[a-z0-9_-]{1,512}$/), customTextValidator]],
    category: [template?.category ?? '', Validators.required],
    channelId: [template?.channelId ?? '', Validators.required],
    language: [template?.language ?? '', Validators.required],
    id: [template?.id ?? ''],
    templateId: [template?.templateId ?? ''],
    headerExamples: loadExamples(fb, 'headerExamples', template),
    bodyExamples: loadExamples(fb, 'bodyExamples', template),
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

function loadExamples(fb: FormBuilder, section: string, template?: MessageTemplate) {
  if(!template) return fb.array([]);

  const examples = fb.array([]) as FormArray;

  template[section]?.forEach((example: VariableExample) => {
    examples.push(createExampleFB(example, fb));
  })
  return examples;
}

function createExampleFB(example: VariableExample, fb: FormBuilder)
{
  return fb.group({
    name: [example?.name ?? ''],
    value: [example?.value ?? '']
  });
}