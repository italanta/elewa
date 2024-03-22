import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


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
export class QuestionsBlockComponent implements OnInit 
{
  @ViewChild('inputOtion') inputOtion: ElementRef;
  @ViewChildren('optionInputFields') optionInputFields: QueryList<OptionInputFieldComponent>;

  private currentIndex = 0; 

  @Input() id: string;
  @Input() block: QuestionMessageBlock;
  @Input() questionMessageBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  questionOptions: FormGroup;

  type: StoryBlockTypes;
  questiontype = StoryBlockTypes.QuestionBlock;
  blockFormGroup: FormGroup;

  readonly questionOptionInputLimit = questionOptionInputLimit;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.block.options?.forEach((option) => {
      this.options.push(this.addQuestionOptions(option));
    })
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

  addNewOption() {
    if (this.options.length < questionOptionsArrayLimit) this.options.push(this.addQuestionOptions());
    setTimeout(() => {
      this.setFocusOnNextInput();
    });
  }

  deleteInput(i: number) {
    this.options.removeAt(i);
    // TODO: Wrapper around jsPlumb instance that can take care of such operations more cleanly
    const conns = this.jsPlumb.connections.filter((c) => c.sourceId === `i-${i}-${this.id}`);
    conns.forEach(c => this.jsPlumb.deleteConnection(c));
  }

  setFocusOnNextInput() {
    this.currentIndex = __FocusCursorOnNextInputOfBlock(
      this.currentIndex,
      this.optionInputFields
    );
  }
}
