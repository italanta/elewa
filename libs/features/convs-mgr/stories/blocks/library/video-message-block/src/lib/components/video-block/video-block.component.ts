import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


@Component({
  selector: 'app-video-block',
  templateUrl: './video-block.component.html',
  styleUrls: ['./video-block.component.scss'],
})

export class VideoBlockComponent implements OnInit {

  @Input() id: string;
  @Input() block: VideoMessageBlock; 
  @Input() videoMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  videoLink: string = "";
  videoInputId: string;
  defaultImage: string ="assets/images/lib/block-builder/video-block-placeholder.png"


  constructor(private _fb: FormBuilder,
    private _logger: Logger) { }

  ngOnInit(): void {
    this.videoInputId = `vid-${this.id}`
  }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }


  private _decorateInput() {
    let input = document.getElementById(this.videoInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}