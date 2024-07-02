import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Observable, of } from 'rxjs';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionService } from '@app/state/convs-mgr/conversations/assessments';
import { MicroAppAssessmentQuestion } from '@app/model/convs-mgr/micro-app/base';

import { __CalculateProgress } from '../../utils/calculate-progress.util';
import { PageViewMode } from '../../model/view-mode.enum';
import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';
import { AppViewService } from '../../services/content-view-mode.service';


@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit 
{
  /** Whether a user is viewing assessment content or general page content */
  pageView: Observable<PageViewMode>;
  pageViewMode = PageViewMode;

  @Input() assessmentQuestions: MicroAppAssessmentQuestion[];
  @Input() assessment: Assessment 

  questions$: Observable<AssessmentQuestion[]>;
  /** Form declarations */
  assessmentFormArray: FormArray;
  assessmentForm: FormGroup;

  /** Grading scores */
  passCriteria: any;

  /* How far a learner is in answering questions */
  progressPercentage = 0;

  constructor ( private _assessFormService: MicroAppAssessmentQuestionFormService,
                private _pageViewservice: AppViewService,
                private _fb: FormBuilder,
                private _assessmentQuestion: AssessmentQuestionService
  ){}

  ngOnInit() {
    this.pageView = this._pageViewservice.getPageViewMode();

    this.buildForms();
    this.getProgress();
  }

  getAssessmentQuestions() {
    if (this.assessment) {
      this.questions$ = this._assessmentQuestion.getQuestionsByAssessmentId$(this.assessment.id);
    } else {
      this.questions$ = of([]); // Return an empty observable
    }
  }
  
  /**Building assessment forms */
  buildForms(): void {
    this.questions$.subscribe(questions => {
      const microAppQuestions: MicroAppAssessmentQuestion[] = questions.map(question => ({
        id: question.id,
        message: question.message,
        questionType: question.questionType,
        marks: question.marks,
        feedback: question.feedback,
        options: question.options?.map(option => ({
          id: option.id,
          text: option.text,
          accuracy: option.accuracy,
          feedback: option.feedback
      })),
        prevQuestionId: question.prevQuestionId,
        nextQuestionId: question.nextQuestionId
      }) as MicroAppAssessmentQuestion);

      this.assessmentFormArray = this._assessFormService.createMicroAppAssessment(microAppQuestions);
      this.assessmentForm = this._fb.group({
        assessmentFormArray: this.assessmentFormArray
      });
    });
  }

  /** Tracking how far a learner is in their assignment  */
  getProgress(){
    this.progressPercentage = __CalculateProgress(this.assessmentFormArray);
  }
  
  /** Get the color for the progress bar */
  getProgressColor(progress: number): string {
    // Calculate the gradient stop position based on the progress percentage
    const gradientStopPosition = progress / 100;

    // Generate the linear gradient string
    return `linear-gradient(to right, white ${gradientStopPosition}%, #1F7A8C ${gradientStopPosition}%)`;
  }

  startAssignment(){
    this._pageViewservice.setPageViewMode(PageViewMode.AssessmentMode)
  }
}