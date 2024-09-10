import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-image-output-block-edit',
  templateUrl: './image-output-block-edit.component.html',
  styleUrl: './image-output-block-edit.component.scss'
})
export class ImageOutputBlockEditComponent {
  @Input() id: string;
  @Input() block: ImageMessageBlock;
  @Input() title: string;
  @Input() icon: string;
  @Input() form: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
}
