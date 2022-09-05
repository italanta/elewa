import { Component, OnInit,Input } from '@angular/core';

import { FormGroup,FormBuilder } from '@angular/forms';
import { Logger } from '@iote/bricks-angular';

import { ImageMessageBlock} from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '../../../../../block-options/src/lib/providers/jsplumb-decorator.function';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss'],
})
export class ImageBlockComponent implements OnInit 
{

  @Input () id:string;
  @Input () block: ImageMessageBlock;
  @Input () imageMessageForm: FormGroup;
  @Input () jsPlumb: BrowserJsPlumbInstance;

  constructor(private _fb:FormBuilder,
              private _logger:Logger) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  private _decorateInput() {
    let input = document.getElementById('fileSrc') as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
