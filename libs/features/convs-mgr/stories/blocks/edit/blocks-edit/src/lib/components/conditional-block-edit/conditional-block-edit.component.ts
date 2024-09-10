import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ConditionalBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-conditional-block-edit',
  templateUrl: './conditional-block-edit.component.html',
  styleUrl: './conditional-block-edit.component.scss',
})
export class ConditionalBlockEditComponent {
  @Input() id: string;
  @Input() block: ConditionalBlock;
  @Input() title: string;
  @Input() icon: string;
  @Input() form: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
}
