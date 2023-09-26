import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { PhoneMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-phone-block',
  templateUrl: './phone-block.component.html',
  styleUrls: ['./phone-block.component.scss'],
})
export class PhoneBlockComponent implements OnInit, AfterViewInit {
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
  }

  ngAfterViewInit(): void {
    this.setFocusOnInput();
  }
  private setFocusOnInput() {
      const inputElement = this.el.nativeElement.querySelector(`input[id="${this.phoneInputId}"]`);
      if (inputElement) {
        inputElement.focus();
      }
  }
}
