import { Component, OnInit, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FormGroup, FormBuilder } from '@angular/forms';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { VideoInputBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-video-input-block',
  templateUrl: './video-input-block.component.html',
  styleUrls: ['./video-input-block.component.scss'],
})
export class VideoInputBlockComponent implements OnInit{
  @Input() id: string;
  @Input() block: VideoInputBlock;
  @Input() videoInputForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  videoInputId: string;

  type: StoryBlockTypes;
  videotype = StoryBlockTypes.VideoInput;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.videoInputId = `video-${this.id}`
  }
}