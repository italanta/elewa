import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';


import { MultipleInputMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-multiple-input-block',
  templateUrl: './multiple-input-block.component.html',
  styleUrls: ['./multiple-input-block.component.scss'],
})
export class MultipleInputBlockComponent<T> implements OnInit, AfterViewInit {
 
  @Input() id: string;
  @Input() block: MultipleInputMessageBlock;
  @Input() multipleInputMessageBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  type: StoryBlockTypes;
  inputType= StoryBlockTypes.MultipleInput;
  foods = ['Pizza'];

  constructor (private _fb: FormBuilder){}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.block.options?.forEach((listItem) => {
      this.listItems.push(this.addListOptions(listItem));
    })
  }

  get listItems () : FormArray {
    return this.multipleInputMessageBlock.controls['options'] as FormArray;
  }

  addListOptions (listItem? : ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [listItem?.id ?? `${this.id}-${this.listItems.length + 1}`],
      message: [listItem?.message ?? ''],
      value: [listItem?.value ?? '']
    })
  }

  addNewOption() {
    if (this.listItems.length<9){
      this.listItems.push(this.addListOptions());
    }
  }

  addfood(newfood: string) {
    if (newfood) {
      this.foods.push(newfood);
    }
  }
  }



