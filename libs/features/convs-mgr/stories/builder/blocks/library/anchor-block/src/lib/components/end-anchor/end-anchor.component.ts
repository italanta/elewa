import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbTargetLeftComponentDecorator } from '../../providers/jsplumb-target-decorator.function';

@Component({
  selector: 'app-end-anchor',
  templateUrl: './end-anchor.component.html',
  styleUrls: ['./end-anchor.component.scss'],
})
export class EndAnchorComponent implements AfterViewInit {
  @Input() id: string;
  @Input() block: EndStoryAnchorBlock;
  @Input() endStoryAnchorForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() showDeleteButton = true; 
  @Output() deleteButtonClick: EventEmitter<void> = new EventEmitter<void>();



  endAnchorId = 'story-end-anchor';

  ngAfterViewInit(): void {
    this._decorateInput();
  }

  private _decorateInput() {
    const input = document.getElementById(this.id) as Element;

    if (this.jsPlumb) {
      _JsPlumbTargetLeftComponentDecorator(input, this.jsPlumb);
    }
  }
  deleteMe() {
    this.deleteButtonClick.emit();
  }
}
