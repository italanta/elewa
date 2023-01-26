import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';


import { WebhookMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlock, StoryBlockTypes, HttpMethodTypes, VariablesConfig, Variable } from '@app/model/convs-mgr/stories/blocks/main';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { VariablesConfigStore } from '@app/state/convs-mgr/stories/variables-config';


@Component({
  selector: 'app-webhook-block',
  templateUrl: './webhook-block.component.html',
  styleUrls: ['./webhook-block.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WebhookBlockComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() block: WebhookMessageBlock;
  @Input() webhookMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;



  webhookInputId: string;
  httpUrl: VariablesConfig;
  methods = new FormControl();
  httpDropdown = new FormControl();
  httpMethods: any[] = [
    { method: HttpMethodTypes.POST, name: 'POST' },
    { method: HttpMethodTypes.GET, name: 'GET' },
    { method: HttpMethodTypes.DELETE, name: 'DELETE' }
  ];
  subscription: Subscription;

  type: StoryBlockTypes;
  webhookType = StoryBlockTypes.Webhook;
  variables = new FormControl();
  variables$: Observable<Variable[]>

  constructor(private _fb: FormBuilder,
    private _variablesStore$$: VariablesConfigStore
  ) { }

  ngOnInit() {

    this.variables$ = this._variablesStore$$.get();

    this.webhookInputId = `webhook-${this.id}`;
    this.httpUrl;
    this.httpMethods
    this.subscription = this.httpDropdown.valueChanges
      .subscribe(value => console.log(value));

  }

  ngAfterViewInit(): void {
    ///
  }

}
