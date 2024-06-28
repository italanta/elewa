import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { SubSink } from 'subsink';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentBrick } from '@app/model/convs-mgr/stories/blocks/messaging';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { _JsPlumbComponentDecorator, _JsPlumbInputOptionDecorator } from '../../providers/decorate-jsplumb.provider';


@Component({
  selector: 'app-assessment-brick',
  templateUrl: './assessment-brick.component.html',
  styleUrls: ['./assessment-brick.component.scss'],
})


export class AssessmentBrickComponent implements OnInit, AfterViewInit, OnDestroy
{

  @Input() id: string;
  @Input() block: AssessmentBrick;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() assessmentBrickForm: FormGroup;

  @Input() blocksGroup: FormArray;
  
  private _sBs = new SubSink();

  type: StoryBlockTypes;
  assessmentBrickType = StoryBlockTypes.Assessment;
  blockFormGroup: FormGroup;
  assessments: Assessment[];

  constructor(private _assessmentService$: AssessmentService) { }

  ngOnInit() {
    this.getAssessments();
  }

  ngAfterViewInit(): void
  {
    this._decorateInput();
  }

  /** Get all assessments */
  getAssessments()
  {
    this._sBs.sink = this._assessmentService$.getAssessments$().subscribe((assessments) =>
    {
      // Filter out assessments that have not been published
      this.assessments = assessments.filter((assessment) => assessment.isPublished);
    }
    );
  }

 /** Add JsPlumb connector to max score input */
 private _decorateInput() {
  const optionElements = document.querySelectorAll('.input-score-max'); 
  if (this.jsPlumb) {
    for (const element of Array.from(optionElements)) {
      _JsPlumbInputOptionDecorator(element, this.jsPlumb);
    }
  }
}

  get scores(): FormArray
  {
    return this.assessmentBrickForm.controls['scoreOptions'] as FormArray;
  }

  ngOnDestroy() {
    this._sBs.unsubscribe()
  }
}
