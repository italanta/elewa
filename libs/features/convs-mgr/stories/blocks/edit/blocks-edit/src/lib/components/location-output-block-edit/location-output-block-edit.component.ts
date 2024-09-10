import { Component, ElementRef, Input, NgZone, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { LocationMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-location-block',
  templateUrl: './location-output-block-edit.component.html',
  styleUrls: ['./location-output-block-edit.component.scss'],
})
export class LocationOutputBlockEditComponent  {

  @Input() id: string;
  @Input() block: LocationMessageBlock;
  @Input() title: string;
  @Input() icon: string;
  @Input() form: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  constructor() { }

}
