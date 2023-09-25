import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ElementRef } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { PhoneMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-phone-block',
  templateUrl: './phone-block.component.html',
  styleUrls: ['./phone-block.component.scss'],
})
export class PhoneBlockComponent implements OnInit {
  @Input() id: string;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() block: PhoneMessageBlock;
  @Input() phoneMessageForm: FormGroup;

  phoneInputId: string;
  type: StoryBlockTypes;
  phonetype = StoryBlockTypes.PhoneNumber;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.phoneInputId = `phone-${this.id}`;
    this.setFocusOnInput();
  }
  private setFocusOnInput() {
    // Use a timeout to ensure that the element is available in the DOM
    setTimeout(() => {
      const inputElement = this.el.nativeElement.querySelector(`input[id="${this.phoneInputId}"]`);
      if (inputElement) {
        inputElement.focus();
      }
    });
  }
}
