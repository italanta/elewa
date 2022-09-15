import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { AudioMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


@Component({
  selector: 'app-audio-block',
  templateUrl: './audio-block.component.html',
  styleUrls: ['./audio-block.component.scss'],
})
export class AudioBlockComponent implements OnInit {


@Input() id: string;
@Input() block: AudioMessageBlock;
@Input() audioMessageForm: FormGroup;
@Input() jsPlumb: BrowserJsPlumbInstance;

audioLink: string = "";
audioInputId: string;
defaultImage: string ="assets/images/lib/block-builder/audio-block-placeholder.png"


constructor(private _fb: FormBuilder,
  private _logger: Logger) { }

ngOnInit(): void {
  this.audioInputId = `aud-${this.id}`
}

ngAfterViewInit(): void {
  if (this.jsPlumb) {
    this._decorateInput();
  }
}


private _decorateInput() {
  let input = document.getElementById(this.audioInputId) as Element;
  if (this.jsPlumb) {
    input = _JsPlumbComponentDecorator(input, this.jsPlumb);
  }
}

}
