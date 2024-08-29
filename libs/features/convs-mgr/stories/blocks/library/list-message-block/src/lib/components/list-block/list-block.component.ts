import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { OptionInputFieldComponent, __FocusCursorOnNextInputOfBlock } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-list-block',
  templateUrl: './list-block.component.html',
  styleUrls: ['./list-block.component.scss'],
})
export class ListBlockComponent<T> implements AfterViewInit 
{

  @Input() id: string;
  @Input() block: ListMessageBlock;
  @Input() listMessageBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @ViewChildren('optionInputFields') optionInputFields: QueryList<OptionInputFieldComponent>;

  private currentIndex = 0; 

  readonly listOptionInputLimit = 24;
  readonly listOptionsArrayLimit = 10;
  hitLimit: boolean;

  constructor(private _fb: FormBuilder) 
  { }

/** Prevent default key events for the buttons 
 *    so that the enter key can add a new option */
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent)
  {
    event.preventDefault();
  }

  ngAfterViewInit(): void {
    this.block.options?.forEach((listItem) => {
      this.listItems.push(this.addListOptions(listItem));
    })

    this.hitLimit = this.block.options ? this.block.options?.length >= this.listOptionsArrayLimit : false;
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

    this.hitLimit = this.listItems.length >= this.listOptionsArrayLimit;
  }
  deleteInput(i: number) {
    this.listItems.removeAt(i);
    this.hitLimit = this.listItems.length >= this.listOptionsArrayLimit;
  }

  setFocusOnNextInput() {
    this.currentIndex = __FocusCursorOnNextInputOfBlock(
      this.currentIndex,
      this.optionInputFields
    );
}

}