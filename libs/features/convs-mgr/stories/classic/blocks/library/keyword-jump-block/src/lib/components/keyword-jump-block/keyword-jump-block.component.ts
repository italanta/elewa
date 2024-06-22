import { Component, Input, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { KeywordMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';


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
  keywordType = StoryBlockTypes.keyword;

  constructor(private _fb: FormBuilder) {}

  ngAfterViewInit(): void {
    this.block.options?.forEach((keywordItem) => {
      this.keywordItems.push(this.addKeywordOptions(keywordItem));
    });
  }

  get keywordItems(): FormArray {
    return this.keywordJumpBlock.controls['options'] as FormArray;
  }

  addKeywordOptions(keywordItem?: ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [keywordItem?.id ?? `${this.id}-${this.keywordItems.length + 1}`],
      message: [keywordItem?.message ?? ''],
      value: [keywordItem?.value ?? ''],
    });
  }

  addNewOption() {
    this.keywordItems.push(this.addKeywordOptions());
  }
}
