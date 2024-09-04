import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-audio-block',
  templateUrl: './audio-block.component.html',
  styleUrls: ['./audio-block.component.scss'],
})
export class AudioBlockComponent {
  @Input() id: string;
  @Input() block: VoiceMessageBlock;
  @Input() audioMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
}
