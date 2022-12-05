import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { EmailMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }
  

  private _decorateInput() {
    let input = document.getElementById(this.emailInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }

}