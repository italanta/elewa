import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AudioInputBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-audio-input-message-block',
  templateUrl: './audio-input-message-block.component.html',
  styleUrls: ['./audio-input-message-block.component.scss'],
})
export class AudioInputMessageBlockComponent implements OnInit{
  @Input() id: string;
  @Input() block: AudioInputBlock;
  @Input() audioInputForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  audioInputId: string;

  type: StoryBlockTypes;
  audioInputType = StoryBlockTypes.AudioInput;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.audioInputId = `audio-${this.id}`
  }
}
