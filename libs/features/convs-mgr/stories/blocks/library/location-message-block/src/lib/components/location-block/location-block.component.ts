import { FormGroup, FormBuilder } from '@angular/forms';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { Logger } from '@iote/bricks-angular';

import { LocationMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { _JsPlumbComponentDecorator } from '../../providers/jsplumb-decorator-function'


@Component({
  selector: 'app-location-block',
  templateUrl: './location-block.component.html',
  styleUrls: ['./location-block.component.scss'],
})
export class LocationBlockComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() block: LocationMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() locationMessageForm: FormGroup;

  locationInputId: string;

  constructor(private _fb: FormBuilder,
    private _logger: Logger) { }

  ngOnInit(): void {
    this.locationInputId=`location-${this.id}`
   }



  ngAfterViewInit(): void 
  {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  private _decorateInput() {
    let input = document.getElementById(this.locationInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }

}
