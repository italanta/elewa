import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VariablesConfigStore } from '@app/state/convs-mgr/stories/variables-config';

import { HttpMethods, HttpMethodTypes, StoryBlockTypes, Variable, VariablesConfig } from '@app/model/convs-mgr/stories/blocks/main';
import { WebhookBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-webhook-block',
  templateUrl: './webhook-block.component.html',
  styleUrls: ['./webhook-block.component.scss'],
})
export class WebhookBlockComponent {
  @Input() id: string;
  @Input() block: WebhookBlock;
  @Input() webhookForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  webhookInputId: string;
  httpUrl: VariablesConfig;


  httpCategories: HttpMethods[] = [
    { method: HttpMethodTypes.POST, name: 'POST' },
    { method: HttpMethodTypes.GET, name: 'GET' },
    { method: HttpMethodTypes.DELETE, name: 'DELETE' }
  ];
  preSelectedMethod: number = HttpMethodTypes.POST;
  subscription: Subscription;

  type: StoryBlockTypes;
  webhookType = StoryBlockTypes.WebhookBlock;
  httpMethod = new FormControl(this.preSelectedMethod);
  variables = new FormControl();
  variables$: Observable<Variable[]>

  constructor(private _fb: FormBuilder,
    private _variablesStore$$: VariablesConfigStore
  ) { }

  ngOnInit() {

    this.variables$ = this._variablesStore$$.get();
    this.webhookInputId = `webhook-${this.id}`;
    this.subscription = this.httpMethod.valueChanges
      .subscribe(value => console.log(value));

  }
}
