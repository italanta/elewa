import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';


import { MultipleInputMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ButtonAction } from '../../button-action.model';

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
  collapsed:boolean;
  optionCount = [1];
  addNewOptionAction= ButtonAction.addOption;
  index:number[]

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
    if(ButtonAction.addOption==='ADD_OPTION'){
      
    if (this.listItems.length<9){
      this.listItems.push(this.addListOptions());
    }
    }

  }


   addList(){
    if(ButtonAction.newList==='NEW_LIST'){
      this.optionCount.push(1);
    }
    
   }   

  }



