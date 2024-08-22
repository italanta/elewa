import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TemplateComponents, TemplateMessage, TemplateVariableExample, TextHeader } from '@app/model/convs-mgr/conversations/messages';

import { customTextValidator } from '../utils/validator';

export function createTemplateForm(fb: FormBuilder, template?: TemplateMessage): FormGroup 
{
  return fb.group({
    name: [template?.name ?? '', [Validators.required, Validators.pattern(/^[a-z0-9_-]{1,512}$/), customTextValidator]],
    category: [template?.category ?? '', Validators.required],
    channelId: [template?.channelId ?? '', Validators.required],
    language: [template?.language ?? '', Validators.required],
    id: [template?.id ?? ''],
    externalId: [template?.externalId ?? ''],
    headerExamples: loadExamples(fb, 'header', template),
    bodyExamples: loadExamples(fb, 'body', template),
    content: fb.group({
      header: fb.group({
        type: "TEXT",
        text: [(template?.content?.header as TextHeader)?.text ?? ''],
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

function loadExamples(fb: FormBuilder, section: 'body' | 'header', template?: TemplateMessage) 
{
  const examples = fb.array([]) as FormArray;

  if(!template) 
    return examples;

  const content = template.content as TemplateComponents;
  const sections = content[section]?.examples as TemplateVariableExample[];

  if(sections)
  {
    sections.forEach((example: TemplateVariableExample) => {
      examples.push(createExampleFB(example, fb));
    });
  }
  return examples;
}

function createExampleFB(example: TemplateVariableExample, fb: FormBuilder)
{
  return fb.group({
    name: [example?.name ?? ''],
    value: [example?.value ?? '']
  });
}