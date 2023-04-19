import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { BrickBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-brick-block',
  templateUrl: './brick-block.component.html',
  styleUrls: ['./brick-block.component.scss'],
})
export class BrickBlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: BrickBlock;
  @Input() brickForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() blockFormGroup: FormGroup;

  messageInputId: string;
  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.BrickBlock;

  ngOnInit(): void {
    this.messageInputId = `brick-${this.id}`;
  }
}
