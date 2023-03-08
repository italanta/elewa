import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { VariablesConfigStore } from '@app/state/convs-mgr/stories/variables-config';
import {
  StoryBlockTypes,
  Variable,
  VariablesConfig,
} from '@app/model/convs-mgr/stories/blocks/main';
import { WebhookBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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

  webhookInputId: string;
  httpUrl: VariablesConfig;

  subscription: Subscription;
  type: StoryBlockTypes;
  webhookType = StoryBlockTypes.WebhookBlock;
  variables = new FormControl();
  variables$: Observable<Variable[]>;

  constructor(private _variablesStore$$: VariablesConfigStore) {}

  ngOnInit() {
    this.variables$ = this._variablesStore$$.get();
    this.webhookInputId = `webhook-${this.id}`;
  }
}
