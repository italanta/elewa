import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { MessageTemplate, VariableExample } from '@app/model/convs-mgr/functions';

@Component({
  selector: 'app-body-variables-sample-section',
  templateUrl: './body-variables-sample-section.component.html',
  styleUrls: ['./body-variables-sample-section.component.scss'],
})
export class BodyVariablesSampleSectionComponent implements OnInit {
  @Input() templateForm: FormGroup;
  @Input() template: MessageTemplate;
  section = 'body';

  samplesArray: VariableExample[] = [];

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    if(this.template) {
      this.template.bodyExamples?.forEach((example: VariableExample) => {
          this.bodyExamples.push(this.createExampleFB(example));
      })
    }
  }

  get bodyExamples(): FormArray
  {
    return this.templateForm.controls['bodyExamples'] as FormArray;
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
    this.bodyExamples.push(this.createExampleFB({name}));
  }

  removeExample(name: string)
  {
    const index = this.bodyExamples.value.findIndex((exm: VariableExample) => {
      return exm.name === name;
    });
    if(index !== -1) this.bodyExamples.removeAt(index);
  }
}
