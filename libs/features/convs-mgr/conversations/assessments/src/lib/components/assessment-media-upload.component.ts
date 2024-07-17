import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  mediaSrc: File;
  isUploading: boolean;
  path: string;
  private _sBS = new SubSink ();

  @ViewChild('mediaUpload') input: ElementRef<HTMLInputElement>;

  constructor(public dialogRef: MatDialogRef<AssessmentMediaUploadComponent>,
               @Inject(MAT_DIALOG_DATA) public data: { fileType: string, assessmentFormGroup: FormGroup }, 
               private _uploadService: FileStorageService,          
  ) {
    this.assessmentFormGroup = this.data.assessmentFormGroup;
    this.fileAccept = data.fileType === 'image' ? 'image/*' : 'video/*';
  }

  ngOnInit()
  {
    this.path = this.assessmentFormGroup.controls['mediaPath'].value 
  }

  onFileSelected(event: any): void 
  {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      this.handleFileSelection(this.selectedFile);
    }
  }

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

  async uploadFile(file: File): Promise<void> {
    this.isUploading = true;
    this.uploadProgress = 0;
    const mediaName = this.assessmentFormGroup.controls['mediaPath'].value || this.selectedFile.name;

    const result = await this._uploadService.uploadSingleFile(this.selectedFile, `assessmentMedia/${mediaName}`);
    this. _sBS.sink = result.subscribe({
      next: (progress: number) => {
        this.uploadProgress = Math.round(progress);
        if (this.uploadProgress === 100) {
          this.isUploading = false;
          this.dialogRef.close(file);
        }
      },
      error: (error: any) => {
        console.error('Upload failed', error);
        this.isUploading = false;
      }
    }); 
  }

  onCancel(): void 
  {
    if (!this.path) {
      this.assessmentFormGroup.controls['mediaPath'].setValue('');
    }
    this.dialogRef.close();
  }
}
