import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function createEmptyTemplateForm(fb: FormBuilder): FormGroup {
  return fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    language: ['', Validators.required],
    content: fb.group({
      header: [''],
      body: fb.group({
        text: ['', Validators.required],
        newVariable: ['', Validators.required],
        newPlaceholder: ['', Validators.required],
        examples: fb.array([]),
      }),
      footer: [''],
      templateId: [''],
      sent: [''],
    }),
    buttons: fb.array([]),
  });
}
