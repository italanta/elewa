import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { TemplateMessage, TemplateVariableExample } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-body-variables-sample-section',
  templateUrl: './body-variables-sample-section.component.html',
  styleUrls: ['./body-variables-sample-section.component.scss'],
})
export class BodyVariablesSampleSectionComponent {
  @Input() templateForm: FormGroup;
  @Input() template: TemplateMessage;
  section = 'body';

  samplesArray: TemplateVariableExample[] = [];

  constructor(private _fb: FormBuilder) {}

  get bodyExamples(): FormArray
  {
    return this.templateForm.controls['bodyExamples'] as FormArray;
  }

  createExampleFB(example?: TemplateVariableExample)
  {
    return this._fb.group({
      name: [example?.name ?? ''],
      value: [example?.value ?? '']
    });
  }

  addExample(name: string)
  {
    this.bodyExamples.push(this.createExampleFB({name}));
  }

  removeExample(name: string)
  {
    const index = this.bodyExamples.value.findIndex((exm: TemplateVariableExample) => {
      return exm.name === name;
    });
    if(index !== -1) this.bodyExamples.removeAt(index);
  }
}
