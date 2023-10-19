import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { OptionInputFieldComponent } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { CursorFocusService } from '@app/features/convs-mgr/stories/blocks/library/main';



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
  @ViewChildren('optionInputFields') optionInputFields: QueryList<OptionInputFieldComponent>;

  private currentIndex = 0; 

  readonly listOptionInputLimit = 24;
  readonly listOptionsArrayLimit = 10;

  constructor(private _fb: FormBuilder, private cursorFocusService: CursorFocusService) { }

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
    if (this.listItems.length < this.listOptionsArrayLimit) this.listItems.push(this.addListOptions());
    setTimeout(() => {
      this.setFocusOnNextInput();
    });
  }
  deleteInput(i: number) {
    this.listItems.removeAt(i);
  }

  setFocusOnNextInput() {
    this.currentIndex = this.cursorFocusService.focusOnNextInput(
      this.currentIndex,
      this.optionInputFields
    );
}
}