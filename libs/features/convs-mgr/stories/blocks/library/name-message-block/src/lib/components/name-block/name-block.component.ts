import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input} from '@angular/core';

import { NameMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-name-block',
  templateUrl: './name-block.component.html',
  styleUrls: ['./name-block.component.scss'],
})
export class NameBlockComponent implements OnInit
{
  @Input() id: string;
  @Input() block: NameMessageBlock;
  @Input() nameMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  nameInputId: string;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.nameInputId = `name-${this.id}`
  }
}
