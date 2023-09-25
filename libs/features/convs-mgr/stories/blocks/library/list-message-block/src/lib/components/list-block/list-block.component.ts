import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { OptionInputFieldComponent } from '../../../../../block-options/src/lib/components/option-input-field/option-input-field.component';

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
    if (this.listItems.length < this.listOptionsArrayLimit) this.listItems.push(this.addListOptions());
    setTimeout(() => {
      this.setFocusOnNextInput();
    });
  }
  deleteInput(i: number) {
    this.listItems.removeAt(i);
  }

  setFocusOnNextInput() {
    const inputs = this.optionInputFields.toArray();
  
    if (this.currentIndex !== -1) {
      const nextIndex = this.currentIndex + 1;
  
      // If there is a next input, focus on it; otherwise, focus on the first input
      if (nextIndex < inputs.length) {
        const nextInput = inputs[nextIndex];
        nextInput.setFocus();
        this.currentIndex = nextIndex; // Update the current index
      } else {
        const firstInput = inputs[0];
        firstInput.setFocus();
        this.currentIndex = 0; // Reset the current index to 0
      }
    }
  }
}
