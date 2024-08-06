import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { FileStorageService } from '@app/state/file';

@Component({
  selector: 'app-assessment-media-upload',
  templateUrl: './assessment-media-upload.component.html',
  styleUrl: './assessment-media-upload.component.scss',
})
export class AssessmentMediaUploadComponent implements OnInit
{
  @Output() fileUploaded = new EventEmitter<File>();
  fileAccept: string;
  uploadProgress = 0;
  selectedFile: File;
  assessmentFormGroup: FormGroup;
  questionFormGroup: FormGroup;
  mediaSrc: File;
  isUploading: boolean;
  path: string;
  index: number 
  questions: FormArray
  private _sBS = new SubSink ();

  @ViewChild('mediaUpload') input: ElementRef<HTMLInputElement>;

  constructor(public dialogRef: MatDialogRef<AssessmentMediaUploadComponent>,
               @Inject(MAT_DIALOG_DATA) public data: { fileType: string, 
                                                       assessmentFormGroup: FormGroup, 
                                                       index: number,
                                                       questionFormGroup: FormGroup;
                                                       questions: FormArray
                                                       }, 
                                                        
               private _uploadService: FileStorageService,          
  ) {
    this.assessmentFormGroup = this.data.assessmentFormGroup;
    this.index = data.index
    this.questionFormGroup = data.questionFormGroup
    this.questions = data.questions
    this.fileAccept = data.fileType === 'image' ? 'image/*' : 'video/*';
  }

  ngOnInit()
  {
    const questions  = this.assessmentFormGroup.get('questions') as FormArray
    this.questions = questions
    this.path = questions.controls[this.index].get('mediaPath')?.value
  }

  get questionsList() {
    return this.assessmentFormGroup.get('questions') as FormArray;
  } 

  /** Handle file selection event */
  onFileSelected(event: any): void 
  {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      this.handleFileSelection(this.selectedFile);
    }
  }

  /** Track files when upload type is drag and drop */
  onDrop(event: DragEvent): void 
  {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /** Upload a file once the user selects it */
  handleFileSelection(file: File): void 
  {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.path = reader.result as string;
      this.mediaSrc = this.selectedFile
      this.assessmentFormGroup.patchValue({ mediaSrc: this.mediaSrc });
      this.uploadFile(this.selectedFile)
    };
  }

  /** Save selected file to firebase  */
  async uploadFile(file: File): Promise<void> 
  {
    this.isUploading = true;
    this.uploadProgress = 0;
    const mediaName = this.questionFormGroup.controls['mediaPath'].value || this.selectedFile.name;
  
    const upload$ = await this._uploadService.uploadSingleFileAndPercentage(this.selectedFile, `assessmentMedia/${mediaName}`);
    
    this._sBS.sink = upload$.subscribe(({ progress, downloadURL, filePath }) => {
      this.uploadProgress = Math.round(progress);
      if (this.uploadProgress === 100) {
        if(downloadURL){
          this.isUploading = false;
          this.dialogRef.close(downloadURL); // Close dialog with uploaded file path
        } 
      }
    });
  }
  
  onCancel(): void 
  {
    this.dialogRef.close();
  }
}
