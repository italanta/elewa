import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { OptionInputFieldComponent, __FocusCursorOnNextInputOfBlock } from '@app/features/convs-mgr/stories/blocks/library/block-options';

const questionOptionInputLimit = 20;
const questionOptionsArrayLimit = 3;

@Component({
  selector: 'app-questions-block',
  templateUrl: './questions-block.component.html',
  styleUrls: ['./questions-block.component.scss'],
})
export class QuestionsBlockComponent implements OnInit, OnDestroy 
{
  @ViewChild('inputOtion') inputOtion: ElementRef;
  @ViewChildren('optionInputFields') optionInputFields: QueryList<OptionInputFieldComponent>;

  private currentIndex = 0; 

  private _sBs = new SubSink();

  @Input() id: string;
  @Input() block: QuestionMessageBlock;
  @Input() questionMessageBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  questionOptions: FormGroup;

  type: StoryBlockTypes;
  questiontype = StoryBlockTypes.QuestionBlock;
  blockFormGroup: FormGroup;

  hitLimit: boolean;

  readonly questionOptionInputLimit = questionOptionInputLimit;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.block.options?.forEach((option) => {
      this.options.push(this.addQuestionOptions(option));
    })
    this.hitLimit = this.block.options ? this.block.options?.length >= questionOptionsArrayLimit : false;

    this.onOptionItemsChange();
  }

  get options(): FormArray {
    return this.questionMessageBlock.controls['options'] as FormArray;
  }

  addQuestionOptions(option?: ButtonsBlockButton<any>) {
    return this._fb.group({
      id: [option?.id ?? `${this.id}-${this.options.length + 1}`],
      message: [option?.message ?? ''],
      value: [option?.value ?? '']
    })
  }

  onOptionItemsChange() {
    this._sBs.sink = this.options.valueChanges.subscribe((val)=> {
      this.hitLimit = val.length >= questionOptionsArrayLimit;
    })
  }

  addNewOption() {
    if (this.options.length < questionOptionsArrayLimit) this.options.push(this.addQuestionOptions());
    setTimeout(() => {
      this.setFocusOnNextInput();
    });
  }

  deleteInput(i: number) {
    const optionElementId = `i-${i}-${this.id}`;

    const optionElement = document.getElementById(optionElementId) as Element;
    
    this.jsPlumb.removeAllEndpoints(optionElement);
    
    this.jsPlumb.deleteConnectionsForElement(optionElement)
    
    this.options.removeAt(i);
  }

  setFocusOnNextInput() {
    this.currentIndex = __FocusCursorOnNextInputOfBlock(
      this.currentIndex,
      this.optionInputFields
    );
  }

  ngOnDestroy(): void {
      this._sBs.unsubscribe();
  }
}
