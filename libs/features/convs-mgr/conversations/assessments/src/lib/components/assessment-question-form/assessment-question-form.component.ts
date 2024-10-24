import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';
import { Observable, tap } from 'rxjs';

import { AssessmentQuestion, QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';
import { FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';

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

  @Input() isLastQuestion: boolean;
  @Input() assessmentMode: number;
  @Input() questionMode: QuestionDisplayMode;
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number;
  @Input() activeCard$: Observable<number>;
  @Input() formEditMode: QuestionFormMode;
  
  @Output() addNewQuestion = new EventEmitter<FormGroup>(); // Emits form
  @Output() activeQuestionChanged = new EventEmitter<number>();
  @Output() questionActionCompleted = new EventEmitter<void>();

  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;


  activeCard: number;

  mediaSrc = '';
  allowedMedia = MediaUploadType;
  addMedia = true;
  isAddingQuestion = true;
  addClicked = false;
  questionFormMode = QuestionFormMode;
  modeToDisplay = QuestionDisplayMode;

  feedBackConditions = [
    FeedbackCondition[1],
    FeedbackCondition[2],
    FeedbackCondition[3],
  ];

  /** Question is in question bank */
  isHighlighted = false;
  constructor(
    private _assessmentFormService: AssessmentFormService,
    private dialog: MatDialog,
    private questionBankService: AssessmentQuestionBankStore,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (this.formEditMode === QuestionFormMode.AssessmentMode) {
      this._subs.sink = this.activeCard$
        .pipe(tap((activeId) => {
          this.activeCard = activeId;

          if (this.questionFormGroupName === activeId) {
            this.questionMode = QuestionDisplayMode.EDITING;
          } else {
            this.questionMode = QuestionDisplayMode.VIEWING;
          }
        })).subscribe();
    }
    // const mediaType = this.formEditMode === QuestionFormMode.AssessmentMode ? this.mediaType.value  : this.questionBankForm.get('mediaAlign')?.value;
    this._checkMediaOnLoad(this.mediaType?.value as MediaUploadType);
  }

  get questionsList() {
    if (this.formEditMode !== QuestionFormMode.AssessmentMode) return;
    return this.assessmentFormGroup.get('questions') as FormArray;
  }

  get questionFormGroup() {
    return this.questionsList?.at(this.questionFormGroupName) as FormGroup;
  }

  get mediaType() {
    return this.questionFormGroup?.get('mediaType');
  }

  get mediaPath() {
    return this.questionFormGroup?.get('mediaPath');
  }

  get mediaAlign() {
    this.questionFormGroup?.get('mediaAlign')?.value;
    return this.questionFormGroup?.get('mediaAlign');
  }

  deleteQuestion() {
    if (this.questionsList) {
      const question = this.questionsList.at(this.questionFormGroupName);
      const prevQuestion = this.questionsList.at(this.questionFormGroupName - 1);
      const nextQuestion = this.questionsList.at(this.questionFormGroupName + 1);

      if (prevQuestion) {
        prevQuestion.patchValue({ nextQuestionId: question.value.nextQuestionId });
      }

      if (nextQuestion) {
        nextQuestion.patchValue({ prevQuestionId: question.value.prevQuestionId });
      }

      this.questionsList.removeAt(this.questionFormGroupName);
    }
  }

  duplicateQuestion() {
    if (this.questionsList) {
      const prevQuestion = this.questionsList.at(this.questionFormGroupName) as FormGroup;
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
        index: this.questionFormGroupName,
        formViewMode: this.formEditMode,
        questionSectionType: QuestionSectionType
      },
      panelClass: 'media-modal'
    });

    dialogRef.afterClosed().subscribe((file: string) => {
      if (file) {
        this.mediaSrc = file;
        this.mediaType?.setValue(type);
        this.mediaPath?.setValue(file);
        this._checkMediaOnLoad(type);
      }
    });
  }

  private _checkMediaOnLoad(mediaType: MediaUploadType): void {

    const mediaPath = this.mediaPath?.value;
    if (mediaPath) {
      this._updateMediaState(mediaPath, mediaType);
    }
  }

  private _updateMediaState(mediaPath: string, mediaType: MediaUploadType): void {
    this.mediaSrc = mediaPath;
    if(mediaType)

    if (mediaType === MediaUploadType.Video && this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
    }
  }

  alignMedia(position: 'media_center' | 'media_right' | 'media_left') {
    this.mediaAlign?.setValue(position);
  }

  addQuestion(): void {
    this.addClicked = true;
    const questionToAdd = this.questionFormGroup.value as AssessmentQuestion;
    if (questionToAdd.id) {
      this._subs.sink = this.questionBankService.update(questionToAdd).subscribe(() => {
        this.questionActionCompleted.emit();
        this.addClicked = false;
      });
    }
  }

  addToQuestionBank() {
    const assessmentQuestion = this.questionFormGroup.value as AssessmentQuestion;
    const isInBank = this.questionFormGroup.get('isInBank')?.value;

    // Toggle the isInBank status
    this.questionFormGroup.get('isInBank')?.setValue(!isInBank);

    if (!isInBank) {
      this.questionBankService.add(assessmentQuestion).subscribe(() => {
        this.showToast('added');
      });
    } else {
      this.questionBankService.remove(assessmentQuestion).subscribe(() => {
        this.showToast('removed');
      }); 
    }
  }
  

  discardQuestion(): void {
    this.questionActionCompleted.emit();
    this.addClicked = false;
    
    this.dialog.closeAll();
  }

  /** Toasting message */
  showToast(action: 'added' | 'removed'): void {
    let message = '';
    if (action === 'added') {
      message = 'Success. Question has been added to the Question Bank';
    } else {
      message = 'Success. Question has been removed from the Question Bank';
    }
    const snackBarRef = this._snackBar.open(message, 'Close', {
      duration: 3000, 
      panelClass: ['success-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
