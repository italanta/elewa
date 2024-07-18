import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentMicroAppBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { _JsPlumbComponentDecorator } from '../../providers/decorate-jsplumb.provider';


@Component({
  selector: 'app-assessment-micro-app-block',
  templateUrl: './assessment-micro-app-block.component.html',
  styleUrls: ['./assessment-micro-app-block.component.scss']
})
export class AssessmentMicroAppBlockComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() block: AssessmentMicroAppBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() assessmentMicroAppForm: FormGroup;
  @Input() blocksGroup: FormArray;

  private _sBs = new SubSink();

  name: string;
  type: StoryBlockTypes;
  assessmentMicroAppType = StoryBlockTypes.MicroAppBlock;
  blockFormGroup: FormGroup;


  assessments: Assessment[];

  constructor(private _assessmentService$: AssessmentService,
  ) { }

  ngOnInit() {
    this.getAssessments();
    this.getAssessmentName();
  }

  ngAfterViewInit(): void
  {
    this._decorateInput();
  }

  /** Get all assessments */
  getAssessments()
  {
    this._sBs.sink = this._assessmentService$.getPublishedAssessments$().subscribe((_assess) => {
        this.assessments = _assess
    });
  }

  getAssessmentName() 
  {
    this.assessmentMicroAppForm.get('appId')?.valueChanges.subscribe((id)=> {
      const name = this.assessments.filter((asmts)=> asmts.id == id)[0].title as string;
      this.assessmentMicroAppForm.patchValue({name})
    })
  }

  /** Add JsPlumb connector to max score input */
  private _decorateInput()
  {
    const inputs = document.getElementsByClassName('option');
    if (this.jsPlumb) {
      for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input = _JsPlumbComponentDecorator(input, this.jsPlumb);
      }
    }
  }
  
}
