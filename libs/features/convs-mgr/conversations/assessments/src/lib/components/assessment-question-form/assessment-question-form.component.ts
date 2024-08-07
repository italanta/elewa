import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { Observable, tap } from 'rxjs';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';
import { AssessmentMediaUploadComponent } from '../assessment-media-upload/assessment-media-upload.component';
import { getMediaType } from '../../utils/check-media-type.util'


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

  @Output() addNewQuestion = new EventEmitter<FormGroup>();
  @Output() activeQuestionChanged = new EventEmitter();
  
  activeCard: number;
  mediaSrc = '';
  uploadType: 'image' | 'video';
  addMedia: true;
  isImage: boolean

  @ViewChild('videoPlayer') video: ElementRef<HTMLVideoElement>;

  constructor(
    private _assessmentForm: AssessmentFormService,
    private dialog: MatDialog,
  ) {}

  feedBackConditions = [
    FeedbackCondition[1],
    FeedbackCondition[2],
    FeedbackCondition[3],
  ];

  ngOnInit(): void {
    this.activeCard$.pipe(tap((activeId) => {
      this.activeCard = activeId;
    })).subscribe();
    this._checkMediaOnLoad();
  }

  get questionsList() {
    return this.assessmentFormGroup.get('questions') as FormArray;
  }

  get questionFormGroup(){
    return this.questionsList.controls[this.questionFormGroupName as number] as FormGroup;
  }

  get mediaPath(){
    return this.questionFormGroup.get('mediaPath') as FormControl;
  }

  /** delete Question */
  deleteQuestion() {
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

  /** duplicate question */
  duplicateQuestion() {
    const prevQuestion = this.questionsList.at(this.index) as FormGroup;

    const copiedQstn = this._assessmentForm.createQuestionForm(prevQuestion.value);
  
    copiedQstn.patchValue({ nextQuestionId : null });
  
    this.addNewQuestion.emit(copiedQstn);
  }

  /** Uploading an image or video and setting hte form control value to the value of the file */
  openUploadModal(type: 'image' | 'video'): void 
  {
    const dialogRef = this.dialog.open(AssessmentMediaUploadComponent, {
      data: { 
              fileType: type,
              assessmentFormGroup: this.assessmentFormGroup,
              index: this.index,
              questions: this.questionsList,
              questionFormGroup: this.questionFormGroup
            },
      panelClass: 'media-modal'
    });

    dialogRef.afterClosed().subscribe((file: string) => {
      if (file) {
        this.mediaSrc =file
        this.uploadType = type;
        this.mediaPath.setValue(file);
      }
    });
  }
  
  private _checkMediaOnLoad()
  {
    const mediaPath = this.mediaPath.value as string | undefined;
    if (mediaPath) {
      this._updateMediaState(mediaPath);
    } else {
      this.isImage = false;
    }
  }

  private _updateMediaState(mediaPath: string)
  {
    this.mediaSrc = mediaPath;
    const mediaType = getMediaType(mediaPath);
    if (mediaType === 'image' || mediaType === 'video') {
      this.uploadType = mediaType;
    } else {
      this.uploadType = 'image'; 
    }
    this.isImage = this.uploadType === 'image';
  
    if (this.uploadType === 'video' && this.video) {
      this.video.nativeElement.load();
    }
  }
  
  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
