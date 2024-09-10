import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-video-output-block-edit',
  templateUrl: './video-output-block-edit.component.html',
  styleUrl: './video-output-block-edit.component.scss',
})
export class VideoOutputBlockEditComponent {
  @Input() id: string;
  @Input() block: VideoMessageBlock;
  @Input() title: string;
  @Input() icon: string;
  @Input() form: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
}
