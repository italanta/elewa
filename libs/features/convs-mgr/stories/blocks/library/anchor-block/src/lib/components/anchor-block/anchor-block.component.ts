import { Component, Input, OnInit } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-anchor-block',
  templateUrl: './anchor-block.component.html',
  styleUrls: ['./anchor-block.component.scss']
})
export class AnchorBlockComponent implements OnInit {
  
  @Input() id: string;
  @Input() block: TextMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  constructor() { }

  ngOnInit(): void {
  }

}
