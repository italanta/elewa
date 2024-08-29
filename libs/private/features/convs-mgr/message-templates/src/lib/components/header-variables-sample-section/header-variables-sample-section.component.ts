import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TemplateMessage, TemplateVariableExample } from '@app/model/convs-mgr/conversations/messages';


@Component({
  selector: 'app-header-variables-sample-section',
  templateUrl: './header-variables-sample-section.component.html',
  styleUrls: ['./header-variables-sample-section.component.scss'],
})
export class HeaderVariablesSampleSectionComponent {
  @Input() templateForm: FormGroup;
  @Input() template: TemplateMessage;
  section = 'header';

  samplesArray: TemplateVariableExample[] = [];

  constructor(private _fb: FormBuilder) {}


  get headerExamples(): FormArray
  {
    return this.templateForm.controls['headerExamples'] as FormArray;
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
    this.headerExamples.push(this.createExampleFB({name}));
  }

  removeExample(name: string)
  {
    const index = this.headerExamples.value.findIndex((exm: TemplateVariableExample) => {
      return exm.name === name;
    });
    if(index !== -1) this.headerExamples.removeAt(index);
  }
}
