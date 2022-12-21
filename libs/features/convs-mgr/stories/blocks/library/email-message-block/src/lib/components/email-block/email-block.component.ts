import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { EmailMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-email-block',
  templateUrl: './email-block.component.html',
  styleUrls: ['./email-block.component.scss'],
})
export class EmailBlockComponent implements OnInit, AfterViewInit 
{
  
  @Input() id: string;
  @Input() block: EmailMessageBlock;
  @Input() emailMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() blockFormGroup: FormGroup;

  emailInputId: string;

  type: StoryBlockTypes;
  emailtype = StoryBlockTypes.Email;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { 
    this.emailInputId = `email-${this.id}`;
  }

  ngAfterViewInit(): void {}
}