import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { getMediaType } from '@app/features/convs-mgr/conversations/assessments';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';

import { QuestionBankMediaUploadComponent } from '../question-bank-media-upload/question-bank-media-upload.component';


@Component({
  selector: 'app-question-bank-question-form',
  templateUrl: './question-bank-question-form.component.html',
  styleUrl: './question-bank-question-form.component.scss',
})
export class QuestionBankQuestionFormComponent implements OnDestroy 
{
  /** Form group */
  @Input() questionFormGroup: FormGroup;
  /** Type of Assessment question */
  question: AssessmentQuestion;
  /** Variable to store media url */
  mediaSrc = '';
  /** Type of media supported */
  uploadType: 'image' | 'video';
  /** Boolean for when a file is an image */
  isImage: boolean;
  /** Form state when user clicks add */
  isAddingQuestion = true;
  addClicked = false
  @Output() questionActionCompleted = new EventEmitter<void>();

  private _sBS = new SubSink();
  
  @ViewChild('videoPlayer') video: ElementRef<HTMLVideoElement>;

  constructor(private questionBankService: AssessmentQuestionBankStore,
              private dialog: MatDialog,
  ){}

  get mediaPath(){
    return this.questionFormGroup.get('mediaPath') as FormControl;
  }

  /** Uploading an image or video and setting hte form control value to the value of the file */
  openUploadModal(type: 'image' | 'video'): void 
  {
    const dialogRef = this.dialog.open(QuestionBankMediaUploadComponent, {
      data: { 
              fileType: type,
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
  /** Check if media is present when component first loads */
  private _checkMediaOnLoad()
  {
    const mediaPath = this.mediaPath.value as string | undefined;
    if (mediaPath) {
      this._updateMediaState(mediaPath);
    } else {
      this.isImage = false;
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
    this.isImage = this.uploadType === 'image';
  
    if (this.uploadType === 'video' && this.video) {
      this.video.nativeElement.load();
    }
  }

  /** Update or create a new question depending on whether a question is new*/
  addQuestion()
  {
    this.addClicked = true
    const questionToAdd = this.questionFormGroup.value as AssessmentQuestion;
    if(questionToAdd.id !== ''){
      this._sBS.sink = this.questionBankService.update(questionToAdd ).subscribe(()=> {
        this.questionActionCompleted.emit(); 
        this.addClicked = false
      })
    }else{
      this._sBS.sink = this.questionBankService.add(questionToAdd ).subscribe(()=> {
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
  ngOnDestroy(): void {
    this._sBS.unsubscribe()
  }
}
