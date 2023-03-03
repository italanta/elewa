import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

const listOptionInputLimit: number = 24;
const listOptionsArrayLimit: number = 10;

@Component({
  selector: 'app-list-block',
  templateUrl: './list-block.component.html',
  styleUrls: ['./list-block.component.scss'],
})
export class ListBlockComponent<T> implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() block: ListMessageBlock;
  @Input() listMessageBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  type: StoryBlockTypes;
  listType = StoryBlockTypes.List;

  readonly listOptionInputLimit = listOptionInputLimit;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.block.options?.forEach((listItem) => {
      this.listItems.push(this.addListOptions(listItem));
    })
  }

  get listItems(): FormArray {
    return this.listMessageBlock.controls['options'] as FormArray;
  }

  addListOptions(listItem?: ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [listItem?.id ?? `${this.id}-${this.listItems.length + 1}`],
      message: [listItem?.message ?? ''],
      value: [listItem?.value ?? '']
    })
  }

  addNewOption() {
    if (this.listItems.length < listOptionsArrayLimit) this.listItems.push(this.addListOptions());
  }
  deleteInput(i: number) {
    this.listItems.removeAt(i);
  }
}
