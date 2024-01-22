import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription, Observable, of } from 'rxjs';

import { VariablesConfigStore } from '@app/state/convs-mgr/stories/variables-config';
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

  vars$: Observable<string[]>;
  variablesToPost: string[];

  httpCategories: HttpMethods[] = [
    { method: HttpMethodTypes.POST, name: 'POST' },
    { method: HttpMethodTypes.GET, name: 'GET' },
    { method: HttpMethodTypes.DELETE, name: 'DELETE' }
  ];

  webhookInputId: string;
  httpUrl: VariablesConfig;

  subscription: Subscription;
  type: StoryBlockTypes;
  webhookType = StoryBlockTypes.WebhookBlock;
  variables = new FormControl();
  search: FormControl;
  userName: FormControl;
  userValue: FormControl;
  variables$: Observable<Variable[]>;

  constructor(private variableService: VariablesService) { }


  ngOnInit() {
    this.vars$ = this.variableService.getAllVariables();
    this.webhookInputId = `webhook-${this.id}`;

    this.search = new FormControl('');
    this.userName = new FormControl('', Validators.required);
    this.userValue = new FormControl('', Validators.required);

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

  /**
   * Submits webhook form
   */

  onSubmit(){
    const variablesToSave: VariablesToSave = {
      name:this.userName.value,
      value: this.userValue.value
    }
    
    // pushes variablesToSave in webhookForm control
    this.webhookForm.get('variablesToSave')?.value.push(variablesToSave)

  }
}
