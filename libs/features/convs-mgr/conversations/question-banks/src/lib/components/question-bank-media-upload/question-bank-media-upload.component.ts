import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { FileStorageService } from '@app/state/file';

@Component({
  selector: 'app-question-bank-media-upload',
  templateUrl: './question-bank-media-upload.component.html',
  styleUrl: './question-bank-media-upload.component.scss',
})
export class QuestionBankMediaUploadComponent implements OnInit
{
  @Output() fileUploaded = new EventEmitter<File>();
  fileAccept: string;
  uploadProgress = 0;
  selectedFile: File;
  questionFormGroup: FormGroup;
  mediaSrc: File;
  isUploading: boolean;
  path: string;
  private _sBS = new SubSink ();

  @ViewChild('mediaUpload') input: ElementRef<HTMLInputElement>;

  constructor(public dialogRef: MatDialogRef<QuestionBankMediaUploadComponent >,
               @Inject(MAT_DIALOG_DATA) public data: { fileType: string, 
                                                       questionFormGroup: FormGroup;
                                                       }, 
                                                        
               private _uploadService: FileStorageService,          
  ) {
    this.questionFormGroup = data.questionFormGroup
    this.fileAccept = data.fileType === 'image' ? 'image/*' : 'video/*';
  }

  ngOnInit()
  {
    this.path = this.questionFormGroup.get('mediaPath')?.value
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
      this.questionFormGroup.patchValue({ mediaSrc: this.mediaSrc });
      this.uploadFile(this.selectedFile)
    };
  }
  /** Programmatically open the file explorer */
  openFileExplorer(accept: string): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept; // set the accepted file types
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileSelection(file);
      }
    });

    // Append to the body to trigger the click event
    document.body.appendChild(fileInput);
    fileInput.click();

    // Remove the input from the DOM after usage
    document.body.removeChild(fileInput);
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

