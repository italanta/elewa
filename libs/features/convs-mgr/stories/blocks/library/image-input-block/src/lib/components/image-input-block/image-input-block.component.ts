import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FormGroup, FormBuilder } from '@angular/forms';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageInputBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-image-input-block',
  templateUrl: './image-input-block.component.html',
  styleUrls: ['./image-input-block.component.scss'],
})
export class ImageInputBlockComponent implements OnInit, AfterViewInit {
  @Input() id: string;
  @Input() block: ImageInputBlock;
  @Input() imageInputForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  imageInputId: string;

  type: StoryBlockTypes;
  imagetype = StoryBlockTypes.ImageInput;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder, private el: ElementRef) { }

  ngOnInit(): void {
    this.imageInputId = `image-${this.id}`
  }
  ngAfterViewInit(): void {
    this.setFocusOnInput() 
  }
  private setFocusOnInput() {
      const inputElement = this.el.nativeElement.querySelector(`input[id="${this.imageInputId}"]`);
      if (inputElement) {
        inputElement.focus();
      }
  }
}