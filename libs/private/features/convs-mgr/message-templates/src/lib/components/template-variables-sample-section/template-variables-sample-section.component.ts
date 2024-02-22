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
        if(example.section == this.section) {
          this.examples.push(this.createExampleFB(example));
        }
      })

      // TEMP: Remove after implementation is complete
      this.templateForm.get('examples')?.valueChanges.subscribe(changes=> {
        console.log(changes)
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
      section: [this.section]
    });
  }

  addExample(name: string)
  {
    this.examples.push(this.createExampleFB({name}));
  }

  removeExample(name: string, section: 'body' | 'header')
  {
    const index = this.examples.value.findIndex((exm: VariableExample) => {
      return exm.name === name && exm.section === section
    });
    if(index !== -1) this.examples.removeAt(index);
  }
}
