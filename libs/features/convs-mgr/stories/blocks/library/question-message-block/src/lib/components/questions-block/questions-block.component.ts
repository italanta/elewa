import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { OptionInputFieldComponent } from '../../../../../block-options/src/lib/components/option-input-field/option-input-field.component';
import { CursorFocusService } from '../../../../../main/src/lib/providers/cursor-focus.service';

const questionOptionInputLimit: number = 20;
const questionOptionsArrayLimit: number = 3;

@Component({
  selector: 'app-questions-block',
  templateUrl: './questions-block.component.html',
  styleUrls: ['./questions-block.component.scss'],
})
export class QuestionsBlockComponent implements OnInit, AfterViewInit {
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

  constructor(private _fb: FormBuilder, private cursorFocusService: CursorFocusService) { }

  ngOnInit(): void {
    this.block.options?.forEach((option) => {
      this.options.push(this.addQuestionOptions(option));
    })
  }

  ngAfterViewInit(): void { }

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
  }

  setFocusOnNextInput() {
    this.currentIndex = this.cursorFocusService.focusOnNextInput(
      this.currentIndex,
      this.optionInputFields
    );
  }
}
