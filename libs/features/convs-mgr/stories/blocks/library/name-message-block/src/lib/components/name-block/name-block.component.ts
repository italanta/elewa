import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { NameMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-name-block',
  templateUrl: './name-block.component.html',
  styleUrls: ['./name-block.component.scss'],
})
export class NameBlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: NameMessageBlock;
  @Input() nameMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  nameInputId: string;
  type: StoryBlockTypes;
  nametype = StoryBlockTypes.Name;

  ngOnInit(): void {
    this.nameInputId = `name-${this.id}`;
  }
}
