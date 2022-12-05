import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';


import { PhoneMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-phone-block',
  templateUrl: './phone-block.component.html',
  styleUrls: ['./phone-block.component.scss'],
})
export class PhoneBlockComponent implements OnInit {

  @Input() id: string;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() block: PhoneMessageBlock;
  @Input() phoneMessageForm: FormGroup;

  phoneInputId: string;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.phoneInputId = `phone-${this.id}`;
  }
}

