import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { TranslateService } from '@ngfi/multi-lang';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentMicroAppBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';
import { AssessmentStatusTypes } from '@app/model/convs-mgr/micro-app/assessments';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { _JsPlumbComponentDecorator } from '../../providers/decorate-jsplumb.provider';

@Component({
  selector: 'app-assessment-micro-app-block',
  templateUrl: './assessment-micro-app-block.component.html',
  styleUrls: ['./assessment-micro-app-block.component.scss']
})
export class AssessmentMicroAppBlockComponent implements OnInit {

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

  assessmentBlockOptions: any[];

  selectedAssessmentId: string;

  assessments: Assessment[];

  constructor(private _assessmentService$: AssessmentService,
              private _fb: FormBuilder,
              private _translate: TranslateService
  ) { }

  ngOnInit() {
    this.getAssessments();
    this.getAssessmentName();
    this.setAssessmentBlockOptions();

    if(this.assessmentMicroAppForm) {
      this.selectedAssessmentId = this.assessmentMicroAppForm.value.appId;
    }
  }

  /** Get all assessments */
  getAssessments()
  {
    this._sBs.sink = this._assessmentService$.getPublishedAssessments$().subscribe((_assess) => {
        this.assessments = _assess
    });
  }

  onAssessmentSelected(assessment: Assessment) {
    this.selectedAssessmentId = assessment.id as string;
    this.assessmentMicroAppForm.patchValue({appId: this.selectedAssessmentId});
  }


  getAssessmentName() 
  {
    this.assessmentMicroAppForm.get('appId')?.valueChanges.subscribe((id)=> {
      const name = this.assessments.filter((asmts)=> asmts.id == id)[0].title as string;
      this.assessmentMicroAppForm.patchValue({name})
    })
  }

  get options(): FormArray
  {
    return this.assessmentMicroAppForm.controls['options'] as FormArray;
  }

  setAssessmentBlockOptions()
  {
    this.assessmentBlockOptions = [{
      message: this._translate.translate("PAGE-CONTENT.BLOCK.BUTTONS.ASSESSMENT-MICROAPP-BLOCK.PASSED"),
      value: AssessmentStatusTypes.Passed
    },
    {
      message: this._translate.translate("PAGE-CONTENT.BLOCK.BUTTONS.ASSESSMENT-MICROAPP-BLOCK.FAILED"),
      value: AssessmentStatusTypes.Failed
    },
    {
      message: this._translate.translate("PAGE-CONTENT.BLOCK.BUTTONS.ASSESSMENT-MICROAPP-BLOCK.INCOMPLETE"),
      value: AssessmentStatusTypes.Incomplete
    },
    ];

    this.assessmentBlockOptions.forEach((option) =>
    {
      this.options.push(this.addAssessmentBlockOptions(option));
    });
  }

  addAssessmentBlockOptions(option?: any)
  {
    return this._fb.group({
      id: [option?.id ?? `${this.id}-${this.options.length + 1}`],
      message: [option?.message ?? ''],
      value: [option?.value ?? '']
    });
  }

  /** Add JsPlumb connector to max score input */
  private _decorateInput()
  {
    const inputs = document.getElementsByClassName('assessment-option');
    if (this.jsPlumb) {
      for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input = _JsPlumbComponentDecorator(input, this.jsPlumb);
      }
    }
  }
  
}
