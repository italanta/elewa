import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';

import { AnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
@Component({
  selector: 'app-anchor-block',
  templateUrl: './anchor-block.component.html',
  styleUrls: ['./anchor-block.component.scss'],
})
export class AnchorBlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: AnchorBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() anchorBlockForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
