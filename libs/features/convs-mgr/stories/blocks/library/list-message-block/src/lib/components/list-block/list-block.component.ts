import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { OptionInputFieldComponent, __FocusCursorOnNextInputOfBlock } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-list-block',
  templateUrl: './list-block.component.html',
  styleUrls: ['./list-block.component.scss'],
})
export class ListBlockComponent<T> implements AfterViewInit, OnInit {
  @Input() id: string;
  @Input() block: ListMessageBlock;
  @Input() listMessageBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @ViewChildren('optionInputFields') optionInputFields: QueryList<OptionInputFieldComponent>;

  private currentIndex = 0;

  readonly listOptionInputLimit = 24;
  readonly listOptionsArrayLimit = 10;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.listMessageBlock.get('RadioButtonControl')) {
      this.listMessageBlock.addControl('RadioButtonControl', this._fb.control(null));
    }
  }

  ngAfterViewInit(): void {
    this.block.options?.forEach((listItem) => {
      this.listItems.push(this.addListOptions(listItem));
    });
  }

  get listItems(): FormArray {
    return this.listMessageBlock.controls['options'] as FormArray;
  }

  addListOptions(listItem?: ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [listItem?.id ?? `${this.id}-${this.listItems.length + 1}`],
      message: [listItem?.message ?? ''],
      value: [listItem?.value ?? ''],
    });
  }

  addNewOption() {
    if (this.listItems.length < this.listOptionsArrayLimit) {
      this.listItems.push(this.addListOptions());
      setTimeout(() => {
        this.setFocusOnNextInput();
      });
    }
  }

  deleteInput(i: number) {
    this.listItems.removeAt(i);
    this.hideOptionField();
  }

  setFocusOnNextInput() {
    this.currentIndex = __FocusCursorOnNextInputOfBlock(this.currentIndex, this.optionInputFields);
  }

  updateRadioValue(index: number) {
    const radioControl = this.listMessageBlock.get('RadioButtonControl') as FormControl;
    const currentRadioValue = radioControl.value;

    if (currentRadioValue === index) {
      radioControl.setValue(null);
    } else {
      radioControl.setValue(index);
    }

    this.hideOptionField();
  }

  hideOptionField() {
    const radioControl = this.listMessageBlock.get('RadioButtonControl') as FormControl;
    if (!this.isOptionFieldVisible(radioControl.value)) {
    }
  }

  isOptionFieldVisible(selectedIndex: number): boolean {
    return selectedIndex !== null;
  }
}
