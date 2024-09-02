import { Component, ElementRef, Input, NgZone, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { LocationMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-location-block',
  templateUrl: './location-block.component.html',
  styleUrls: ['./location-block.component.scss'],
})
export class LocationBlockComponent  {

  @ViewChild('mapsSearchField') searchElementRef: ElementRef;
  @ViewChild(GoogleMap) map: GoogleMap;

  @Input() id: string;
  @Input() block: LocationMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() locationMessageForm: FormGroup;

  constructor() { }

}
