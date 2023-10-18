import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { EmailMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-email-block',
  templateUrl: './email-block.component.html',
  styleUrls: ['./email-block.component.scss'],
})
export class EmailBlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: EmailMessageBlock;
  @Input() emailMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() blockFormGroup: FormGroup;

  emailInputId: string;
  type: StoryBlockTypes;
  emailtype = StoryBlockTypes.Email;

  ngOnInit(): void {
    this.emailInputId = `email-${this.id}`;
  }
}
