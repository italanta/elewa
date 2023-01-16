import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { BehaviorSubject, Observable, combineLatest, of, map, Subscription } from 'rxjs';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';


import { WebhookMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlock, StoryBlockTypes, HttpMethodTypes, VariablesConfig } from '@app/model/convs-mgr/stories/blocks/main';
import {
  ImageMessageBlock, LocationMessageBlock, NameMessageBlock, QuestionMessageBlock,
  TextMessageBlock, EmailMessageBlock, PhoneMessageBlock, DocumentMessageBlock, StickerMessageBlock,
  VoiceMessageBlock, VideoMessageBlock, ListMessageBlock, ReplyMessageBlock
} from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-webhook-block',
  templateUrl: './webhook-block.component.html',
  styleUrls: ['./webhook-block.component.scss'],
})
export class WebhookBlockComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() block: WebhookMessageBlock;
  @Input() webhookMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() blockFormGroup: FormGroup;


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

  filterVariableInput$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  webhookType = StoryBlockTypes.Webhook;


  variables = new FormControl();

  inputVariables: StoryBlock[] = [
    { type: StoryBlockTypes.TextMessage, message: 'Message' } as TextMessageBlock,
    { type: StoryBlockTypes.Location, message: 'Location' } as LocationMessageBlock,
    { type: StoryBlockTypes.Image, message: 'Image' } as ImageMessageBlock,
    { type: StoryBlockTypes.QuestionBlock, message: 'Question' } as QuestionMessageBlock,
    { type: StoryBlockTypes.Document, message: 'Document' } as DocumentMessageBlock,
    { type: StoryBlockTypes.Audio, message: 'Audio' } as VoiceMessageBlock,
    { type: StoryBlockTypes.Name, message: 'Name' } as NameMessageBlock,
    { type: StoryBlockTypes.Email, message: 'Email' } as EmailMessageBlock,
    { type: StoryBlockTypes.PhoneNumber, message: 'Phone' } as PhoneMessageBlock,
    { type: StoryBlockTypes.Video, message: 'Video' } as VideoMessageBlock,
    { type: StoryBlockTypes.Sticker, message: 'Sticker' } as StickerMessageBlock,
    { type: StoryBlockTypes.List, message: 'List' } as ListMessageBlock,
  ];

  selectedVariables: any;
  inputVariables$: Observable<StoryBlock[]> = of(this.inputVariables);
  constructor(private _fb: FormBuilder) { }

  ngOnInit() {


    this.webhookInputId = `webhook-${this.id}`;
    this.httpUrl;
    // this.method;
    this.filteredVariables;
    this.subscription = this.httpDropdown.valueChanges
    .subscribe(value => console.log(value));

  }
  filteredVariables() {
    this.inputVariables$ = combineLatest([this.filterVariableInput$$, this.inputVariables$])
      .pipe(map(([filter, variablesArray]) => variablesArray
        .filter((variable: StoryBlock) => {
          return variable.message?.toString().toLowerCase().includes(filter)
          
        })))

  }

  filterVariables(event: any) {
    this.filterVariableInput$$.next(event.target.value);
  }


  ngAfterViewInit(): void {
    ///
  }
}
