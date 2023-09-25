import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { OptionInputFieldComponent } from '../../../../../block-options/src/lib/components/option-input-field/option-input-field.component';

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

  constructor(private _fb: FormBuilder) { }

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
