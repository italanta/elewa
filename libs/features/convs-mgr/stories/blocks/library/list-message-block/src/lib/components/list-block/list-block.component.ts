import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

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
  listType= StoryBlockTypes.List;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.block.listItems?.forEach((listItem: ButtonsBlockButton<T> | undefined) => {
      console.log(listItem);
      this.listItems.push(this.addListOptions(listItem));
    });
  }

  ngAfterViewInit(): void {}

  get listItems(): FormArray {
    return this.listMessageBlock.controls['listItems'] as FormArray;
  }

  addListOptions(listItem?: ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [listItem?.id ?? `${this.id}-${this.listItems.length + 1}`],
      message: [listItem?.message ?? ''],
    });
  }

  initListOptions() {
    this._fb.group({
      listOption: ['', Validators.required],
    });
  }

  addNewOption() {
    this.listItems.push(this.addListOptions());
  }
}
