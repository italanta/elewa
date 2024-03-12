import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { MessageTemplate, VariableExample } from '@app/model/convs-mgr/functions';

@Component({
  selector: 'app-header-variables-sample-section',
  templateUrl: './header-variables-sample-section.component.html',
  styleUrls: ['./header-variables-sample-section.component.scss'],
})
export class HeaderVariablesSampleSectionComponent {
  @Input() templateForm: FormGroup;
  @Input() template: MessageTemplate;
  section = 'header';

  samplesArray: VariableExample[] = [];

  constructor(private _fb: FormBuilder) {}


  get headerExamples(): FormArray
  {
    return this.templateForm.controls['headerExamples'] as FormArray;
  }

  createExampleFB(example?: VariableExample)
  {
    return this._fb.group({
      name: [example?.name ?? ''],
      value: [example?.value ?? '']
    });
  }

  addExample(name: string)
  {
    this.headerExamples.push(this.createExampleFB({name}));
  }

  removeExample(name: string)
  {
    const index = this.headerExamples.value.findIndex((exm: VariableExample) => {
      return exm.name === name;
    });
    if(index !== -1) this.headerExamples.removeAt(index);
  }
}
