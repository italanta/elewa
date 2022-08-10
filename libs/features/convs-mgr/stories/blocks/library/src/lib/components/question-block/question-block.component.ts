import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { FormGroup, FormBuilder, FormArray} from '@angular/forms';

import { QuestionButtonsBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';



@Component({
  selector: 'app-questions',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.scss']
})


export class QuestionsComponent<T> implements OnInit, AfterViewInit{


  @Input() id:string;
  @Input() block:QuestionButtonsBlock<T>;
  @Input () jsPlumb: BrowserJsPlumbInstance;
  @Input () questionsButtonsBlock: FormGroup;
 

  @ViewChild('inputOtion') inputOtion: ElementRef;

  questionButtons: FormGroup;


 
  constructor( private _fb: FormBuilder) { }


  ngOnInit(): void {
    this.block.buttons?.forEach((button) => {
      this.buttons.push(this.addQuestionButtons(button));
    })
  }

  ngAfterViewInit(): void {}

  get buttons () : FormArray {
    return this.questionsButtonsBlock.controls['buttons'] as FormArray;
  }

  addQuestionButtons (buttons? : ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [buttons?.id ?? `${this.id}-${this.buttons.length + 1}`],
      message: [buttons?.message ?? ''],
      value: [buttons?.value ?? '']
    })
  }

  addNewOption() {
    this.buttons.push(this.addQuestionButtons());
  }
}

