import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
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

  constructor(private _variablesStore$$: VariablesConfigStore, private variableser: VariablesService) {
    this.vars$ = this.variableser.getAllVariables();
  }


  ngOnInit() {
    this.variables$ = this._variablesStore$$.get();
    this.webhookInputId = `webhook-${this.id}`;

    this.search = new FormControl('');
    this.userName = new FormControl('', Validators.required);
    this.userValue = new FormControl('', Validators.required);

  }

  /**
 * submits webhook form
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
