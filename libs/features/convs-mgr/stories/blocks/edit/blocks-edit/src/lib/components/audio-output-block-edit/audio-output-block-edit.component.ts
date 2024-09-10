import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-audio-output-block-edit',
  templateUrl: './audio-output-block-edit.component.html',
  styleUrl: './audio-output-block-edit.component.scss',
})
export class AudioOutputBlockEditComponent {
  @Input() id: string;
  @Input() block: VoiceMessageBlock;
  @Input() title: string;
  @Input() icon: string;
  @Input() form: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
}
