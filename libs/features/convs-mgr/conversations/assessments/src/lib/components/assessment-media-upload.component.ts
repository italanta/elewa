import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assessment-media-upload',
  templateUrl: './assessment-media-upload.component.html',
  styleUrl: './assessment-media-upload.component.scss',
})
export class AssessmentMediaUploadComponent 
{
  @Output() fileUploaded = new EventEmitter<File>();
  fileAccept: string;
  uploadProgress = 0;

  constructor(
    public dialogRef: MatDialogRef<AssessmentMediaUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileType: string }
  ) {
    this.fileAccept = data.fileType === 'image' ? 'image/*' : 'video/*';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  uploadFile(file: File): void {
    // Simulate upload progress
    const interval = setInterval(() => {
      if (this.uploadProgress < 100) {
        this.uploadProgress += 10;
      } else {
        clearInterval(interval);
        this.dialogRef.close(file);
      }
    }, 300);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
