import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { Observable, take, tap } from 'rxjs';

import { AssessmentQuestion, QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';
import { FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';

import { getMediaType } from '../../utils/check-media-type.util'
import { QuestionDisplayMode } from '../../model/question-display-mode.enum';

import { MediaUploadModalComponent } from '../../modals/media-upload-modal/media-upload.component';
import { QuestionSectionType } from '../../model/question-section-type.enum';
import { MediaUploadType } from '../../model/media-upload-type.enum';

@Component({
  selector: 'app-assessment-question-form',
  templateUrl: './assessment-question-form.component.html',
  styleUrls: ['./assessment-question-form.component.scss'],
})
export class AssessmentQuestionFormComponent implements OnInit, OnDestroy {

  private _subs = new SubSink();

  @Input() questions: AssessmentQuestion[];
  @Input() questionNo: number;
  @Input() isLastQuestion: boolean;
  @Input() index: number;
  @Input() assessmentMode: number;
  @Input() questionMode: QuestionDisplayMode;
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;
  @Input() activeCard$: Observable<number>;
  @Input() questionBankForm: FormGroup;
  @Input() formEditMode: QuestionFormMode;
  
  @Output() addNewQuestion = new EventEmitter<FormGroup>(); // Emits form
  @Output() activeQuestionChanged = new EventEmitter<number>();
  @Output() questionActionCompleted = new EventEmitter<void>();

  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;


  activeCard: number;

  mediaSrc = '';
  currentMediaType: MediaUploadType;
  allowedMedia = MediaUploadType;
  addMedia = true;
  isImageMedia: boolean;
  isAddingQuestion = true;
  addClicked = false;
  questionFormMode = QuestionFormMode;
  modeToDisplay = QuestionDisplayMode;

  mediaAlign: 'media_center' | 'media_right' | 'media_left';

  feedBackConditions = [
    FeedbackCondition[1],
    FeedbackCondition[2],
    FeedbackCondition[3],
  ];

  constructor(
    private _assessmentFormService: AssessmentFormService,
    private dialog: MatDialog,
    private questionBankService: AssessmentQuestionBankStore,
  ) {}

  ngOnInit(): void {
    if (this.formEditMode === QuestionFormMode.AssessmentMode) {
      this._subs.sink = this.activeCard$
        .pipe(tap((activeId) => {
          this.activeCard = activeId;

          if (this.index === activeId) {
            this.questionMode = QuestionDisplayMode.EDITING;
          } else {
            this.questionMode = QuestionDisplayMode.VIEWING;
          }
        })).subscribe();
    }
    this._checkMediaOnLoad();
  }

  get questionsList() {
    if (this.formEditMode !== QuestionFormMode.AssessmentMode) return;
    return this.assessmentFormGroup.get('questions') as FormArray;
  }

  get questionFormGroup() {
    return this.questionsList?.controls[this.questionFormGroupName as number] as FormGroup;
  }

  get mediaPath() {
    return this.questionFormGroup?.get('mediaPath') as FormControl;
  }

  deleteQuestion() {
    if (this.questionsList) {
      const question = this.questionsList.at(this.index);
      const prevQuestion = this.questionsList.at(this.index - 1);
      const nextQuestion = this.questionsList.at(this.index + 1);

      if (prevQuestion) {
        prevQuestion.patchValue({ nextQuestionId: question.value.nextQuestionId });
      }

      if (nextQuestion) {
        nextQuestion.patchValue({ prevQuestionId: question.value.prevQuestionId });
      }

      this.questionsList.removeAt(this.index);
    }
  }

  duplicateQuestion() {
    if (this.questionsList) {
      const prevQuestion = this.questionsList.at(this.index) as FormGroup;
      const copiedQuestion = this._assessmentFormService.createQuestionForm(prevQuestion.value);

      copiedQuestion.patchValue({ nextQuestionId: null });
      this.addNewQuestion.emit(copiedQuestion);
    }
  }

  openUploadModal(type: MediaUploadType): void {
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
        this.mediaSrc = file;
        this.currentMediaType = type;
        this.mediaPath?.setValue(file);
        this._checkMediaOnLoad();
      }
    });
  }

  private _checkMediaOnLoad(): void {
    const mediaPath = this.mediaPath?.value as string | undefined;
    if (mediaPath) {
      this._updateMediaState(mediaPath);
    } else {
      this.isImageMedia = false;
    }
  }

  private _updateMediaState(mediaPath: string): void {
    this.mediaSrc = mediaPath;
    const mediaType = getMediaType(mediaPath);
    if(mediaType)
    this.currentMediaType = MediaUploadType.Image || MediaUploadType.Video ? mediaType : MediaUploadType.Video ;
    this.isImageMedia = this.currentMediaType === MediaUploadType.Image

    if (this.currentMediaType === MediaUploadType.Video && this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
    }
  }

  alignMedia(position: 'media_center' | 'media_right' | 'media_left') {
    this.mediaAlign = position;
  }

  addQuestion(): void {
    this.addClicked = true;
    const questionToAdd = this.questionBankForm.value as AssessmentQuestion;
    if (questionToAdd.id) {
      this._subs.sink = this.questionBankService.update(questionToAdd).subscribe(() => {
        this.questionActionCompleted.emit();
        this.addClicked = false;
      });
    }
  }

  discardQuestion(): void {
    this.questionActionCompleted.emit();
    this.addClicked = false;
    
    this.dialog.closeAll();
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
