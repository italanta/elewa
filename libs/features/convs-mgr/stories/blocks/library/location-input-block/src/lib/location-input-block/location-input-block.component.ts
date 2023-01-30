import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { LocationInputBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-location-input-block',
  templateUrl: './location-input-block.component.html',
  styleUrls: ['./location-input-block.component.scss'],
})
export class LocationInputBlockComponent {
  @Input() id: string;
  @Input() block: LocationInputBlock;
  @Input() locationInputForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  locationInputId: string;

  type: StoryBlockTypes;
  locationInputType = StoryBlockTypes.LocationInputBlock;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.locationInputId = `location-${this.id}`
  }
}
