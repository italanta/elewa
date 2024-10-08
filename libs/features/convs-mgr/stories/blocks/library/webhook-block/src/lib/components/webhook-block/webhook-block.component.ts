import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

import { VariablesService } from '@app/features/convs-mgr/stories/blocks/process-inputs';

import {
  StoryBlockTypes,
  HttpMethods, 
  HttpMethodTypes,
  Variable,
  VariablesConfig,
} from '@app/model/convs-mgr/stories/blocks/main';

import { WebhookBlock, VariablesToSave } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-webhook-block',
  templateUrl: './webhook-block.component.html',
  styleUrls: ['./webhook-block.component.scss'],
})
export class WebhookBlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: WebhookBlock;
  @Input() webhookForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  allVars$: Observable<string[]>;
  variablesToPost: string[];

  selectedCategoryId: string;

  httpCategories: HttpMethods[] = [
    { method: HttpMethodTypes.POST, name: 'POST', id: '1' },
    { method: HttpMethodTypes.GET, name: 'GET', id: '2' },
    { method: HttpMethodTypes.DELETE, name: 'DELETE', id: '3' }
  ];

  webhookInputId: string;
  httpUrl: VariablesConfig;

  subscription: Subscription;
  type: StoryBlockTypes;
  webhookType = StoryBlockTypes.WebhookBlock;
  variables = new FormControl();
  search: FormControl;

  variables$: Observable<Variable[]>;

  constructor(private variableService: VariablesService, private _fb: FormBuilder) { }


  ngOnInit() {
    this.allVars$ = this.variableService.getAllVariables();
    this.webhookInputId = `webhook-${this.id}`;

    this.search = new FormControl('');

    this.block.variablesToSave?.forEach((varToSave) => {
      this.variablesToSave.push(this.addVariablesToSave(varToSave));
    })

    if(this.webhookForm) {
      const method = this.webhookForm.value.httpMethod;
      this.selectedCategoryId = this.httpCategories.find((cat)=> cat.method === method)?.id as string;
    }
  }

  addVariablesToSave(varToSave?: VariablesToSave) {
    return this._fb.group({
      name: [varToSave?.name ?? ''],
      value: [varToSave?.value ?? '']
    })
  }

  onhttpMethosSelected(httpCategory: HttpMethods) {
    this.selectedCategoryId = httpCategory.id as string;
    this.webhookForm.patchValue({httpMethod: httpCategory.method});
  }


  onChanged(variable: string, event: any) {
    const variablesToPost = this.webhookForm.get('variablesToPost')?.value as string[];

    // Use a set to ensure unique values
    const variableSet = new Set(variablesToPost);

    // If the action is check, then we add the variable to the set,
    //  otherwise we remove it.
    if(event.target.checked) {
      variableSet.add(variable);
    } else {
      variableSet.delete(variable);
    }
    
    this.webhookForm.patchValue({variablesToPost: Array.from(variableSet)});
  }

  isChecked(variable: string) {
    const variablesToPost = this.webhookForm.get('variablesToPost')?.value as string[];

    return variablesToPost.includes(variable);
  }

  get variablesToSave(): FormArray {
    return this.webhookForm.controls['variablesToSave'] as FormArray;
  }


  addVariable() {
    this.variablesToSave.push(this.addVariablesToSave())
  }

  deleteVariable(i: number) 
  {
    this.variablesToSave.removeAt(i);
  }
}
