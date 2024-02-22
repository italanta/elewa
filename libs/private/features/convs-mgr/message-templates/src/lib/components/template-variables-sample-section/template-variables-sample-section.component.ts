import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { MessageTemplate, VariableExample } from '@app/model/convs-mgr/functions';

@Component({
  selector: 'app-template-variables-sample-section',
  templateUrl: './template-variables-sample-section.component.html',
  styleUrls: ['./template-variables-sample-section.component.scss'],
})
export class TemplateVariablesSampleSectionComponent implements OnInit {
  @Input() templateForm: FormGroup;
  @Input() template: MessageTemplate;
  @Input() section: 'header' | 'body';

  samplesArray: VariableExample[] = [];

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    if(this.template) {
      this.template.examples?.forEach((example: VariableExample) => {
          this.examples.push(this.createExampleFB(example));
      })
    }
  }

  get examples(): FormArray
  {
    return this.templateForm.controls['examples'] as FormArray;
  }

  createExampleFB(example?: VariableExample)
  {
    return this._fb.group({
      name: [example?.name ?? ''],
      value: [example?.value ?? ''],
      section: [example?.section ?? '']
    });
  }

  addExample(name: string, section: 'body' | 'header')
  {
    this.examples.push(this.createExampleFB({name, section}));
  }

  removeExample(name: string, section: 'body' | 'header')
  {
    const index = this.examples.value.findIndex((exm: VariableExample) => {
      return exm.name === name && exm.section === section
    });
    if(index !== -1) this.examples.removeAt(index);
  }
}
