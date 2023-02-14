import { Component, Input, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { KeywordMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-keyword-jump-block',
  templateUrl: './keyword-jump-block.component.html',
  styleUrls: ['./keyword-jump-block.component.scss'],
})
export class KeywordJumpBlockComponent<T> implements AfterViewInit {
  @Input() id: string;
  @Input() block: KeywordMessageBlock;
  @Input() keywordJumpBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  type: StoryBlockTypes;
  listType = StoryBlockTypes.List;

  constructor(private _fb: FormBuilder) {}

  ngAfterViewInit(): void {
    this.block.options?.forEach((listItem) => {
      this.listItems.push(this.addListOptions(listItem));
    });
  }

  get listItems(): FormArray {
    return this.keywordJumpBlock.controls['options'] as FormArray;
  }

  addListOptions(listItem?: ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [listItem?.id ?? `${this.id}-${this.listItems.length + 1}`],
      message: [listItem?.message ?? ''],
      value: [listItem?.value ?? ''],
    });
  }

  addNewOption() {
    this.listItems.push(this.addListOptions());
  }
  deleteInput(i: number) {
    this.listItems.removeAt(i);
  }
}
