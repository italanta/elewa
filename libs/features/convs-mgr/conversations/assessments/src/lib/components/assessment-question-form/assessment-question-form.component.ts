import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { Observable, tap } from 'rxjs';

import { AssessmentQuestion, QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';
import { FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';


import { AssessmentFormService } from '../../services/assessment-form.service';

import { getMediaType } from '../../utils/check-media-type.util'
import { MediaUploadModalComponent } from '../../modals/media-upload-modal/media-upload.component';
import { QuestionSectionType } from '../../model/question-section-type.enum';

@Component({
  selector: 'app-assessment-question-form',
  templateUrl: './assessment-question-form.component.html',
  styleUrls: ['./assessment-question-form.component.scss'],
})
export class AssessmentQuestionFormComponent implements OnInit, OnDestroy {

  private _sBs = new SubSink();

  @Input() questions: AssessmentQuestion[];
  @Input() questionNo: number;
  @Input() isLastQuestion: boolean;
  @Input() index: number;
  @Input() assessmentMode: number;
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;
  @Input() activeCard$: Observable<number>;
  @Input() questionBankForm: FormGroup;
  /** Mode between assessments and question banks */
  @Input()  formEditMode: QuestionFormMode
  @Output() addNewQuestion = new EventEmitter<FormGroup>(); //emits form 
  @Output() activeQuestionChanged = new EventEmitter();
  
  activeCard: number;
  mediaSrc = '';
  uploadType: 'image' | 'video';
  addMedia: true;
  mediaType: boolean
  /** Form state when user clicks add */
  isAddingQuestion = true;
  addClicked = false
  questionFormMode = QuestionFormMode
  @Output() questionActionCompleted = new EventEmitter<void>();

  @ViewChild('videoPlayer') video: ElementRef<HTMLVideoElement>;

  constructor(
    private _assessmentForm: AssessmentFormService,
    private dialog: MatDialog,
    private questionBankService: AssessmentQuestionBankStore,
  ) {}

  feedBackConditions = [
    FeedbackCondition[1],
    FeedbackCondition[2],
    FeedbackCondition[3],
  ];

  private _sBS = new SubSink()
  ngOnInit(): void {
    if(this.formEditMode === QuestionFormMode.AssessmentMode){
      this.activeCard$.pipe(tap((activeId) => {
        this.activeCard = activeId;
      })).subscribe();
    }
    this._checkMediaOnLoad();
  }

  get questionsList() {
    if(this.formEditMode !== QuestionFormMode.AssessmentMode) return;
    return this.assessmentFormGroup.get('questions') as FormArray;
  }

  get questionFormGroup(){
    if(!this.questionsList)return
    return this.questionsList.controls[this.questionFormGroupName as number] as FormGroup;
  }

  get mediaPath(){
    if(!this.questionFormGroup)return
    return this.questionFormGroup.get('mediaPath') as FormControl;
  }

  /** delete Question */
  deleteQuestion() {
    if(this.questionsList){
      const question = this.questionsList.at(this.index);
    const prevQuestion = this.questionsList.at(this.index - 1);
    const nextQuestion = this.questionsList.at(this.index + 1);

    if (prevQuestion) {
      prevQuestion.patchValue({ nextQuestionId : question.value.nextQuestionId })
    }

    if (nextQuestion) {
      nextQuestion.patchValue({ prevQuestionId : question.value.prevQuestionId })
    }
    this.questionsList.removeAt(this.index);
    }  
  }

  /** duplicate question */
  duplicateQuestion() {
    if(this.questionsList){
      const prevQuestion = this.questionsList.at(this.index) as FormGroup;

    const copiedQstn = this._assessmentForm.createQuestionForm(prevQuestion.value);
  
    copiedQstn.patchValue({ nextQuestionId : null });
  
    this.addNewQuestion.emit(copiedQstn);
    }
  }

  /** Uploading an image or video and setting hte form control value to the value of the file */
  openUploadModal(type: 'image' | 'video'): void 
  {
    const dialogRef = this.dialog.open(MediaUploadModalComponent, {
      data: { 
              fileType: type,
              assessmentFormGroup: this.assessmentFormGroup,
              index: this.index,
              questions: this.questionsList,
              questionFormGroup: this.questionFormGroup,
              questionBankForm: this.questionBankForm,
              formViewMode: this.formEditMode,
              questionSectionType: QuestionSectionType
            },
      panelClass: 'media-modal'
    });

    dialogRef.afterClosed().subscribe((file: string) => {
      if (file) {
        this.mediaSrc =file
        this.uploadType = type;
        this.mediaType = type === 'image';
        this.mediaPath?.setValue(file);
      }
    });
  }
  /** Check if media is present when component first loads */
  private _checkMediaOnLoad()
  {
    const mediaPath = this.mediaPath?.value as string | undefined;
    if (mediaPath) {
      this._updateMediaState(mediaPath);
    } else {
      this.mediaType = false;
    }
  }
 /** Get media type when a user clicks update media button */
  private _updateMediaState(mediaPath: string)
  {
    this.mediaSrc = mediaPath;
    const mediaType = getMediaType(mediaPath);
    if (mediaType === 'image' || mediaType === 'video') {
      this.uploadType = mediaType;
    } else {
      this.uploadType = 'image'; 
    }
    this.mediaType = this.uploadType === 'image';
  
    if (this.uploadType === 'video' && this.video) {
      this.video.nativeElement.load();
    }
  }

  /** Update or create a new question depending on whether a question is new*/
  addQuestion()
  {
    this.addClicked = true
    const questionToAdd = this.questionBankForm.value as AssessmentQuestion;
    if(questionToAdd.id){
      this._sBS.sink = this.questionBankService.update(questionToAdd ).subscribe(()=> {
        this.questionActionCompleted.emit(); 
        this.addClicked = false
      })
    } 
  }

  discardQuestion()
  {
    this.questionActionCompleted.emit(); 
    this.dialog.closeAll()
  }
  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
