import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ConditionalBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-conditional-block',
  templateUrl: './conditional-block.component.html',
  styleUrls: ['./conditional-block.component.scss'],
})
export class ConditionalBlockComponent {
  @Input() id: string;
  @Input() block: ConditionalBlock;
  @Input() conditionalBlockForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
}
