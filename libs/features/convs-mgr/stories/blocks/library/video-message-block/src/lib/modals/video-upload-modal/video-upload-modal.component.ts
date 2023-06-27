import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileStorageService } from '@app/state/file';

@Component({
  selector: 'app-video-upload-modal',
  templateUrl: './video-upload-modal.component.html',
  styleUrls: ['./video-upload-modal.component.scss'],
})
export class VideoUploadModalComponent implements OnInit {
  videoModalForm: FormGroup;
  videoName: string;
  videoPath: string;
  isUploading: boolean;
  selectedFile: File;

  @ViewChild('inputUpload') input: ElementRef<HTMLInputElement>;

  readonly defaultSize = "Don't Encode Media";

  sizeOptions = [
    { vidSize: '4K', resolution: '3840px x 2160px' },
    { vidSize: '1080p', resolution: '1920px x 1080px' },
    { vidSize: '720p (Recommended)', resolution: '1280px x 720px' },
    { vidSize: '540p', resolution: '960px x 540px' },
    {
      vidSize: "Don't Encode Media",
      resolution: 'This will use the original media you provided',
    },
  ];

  videoInputId = 'videoInput';

  constructor(
    private dialogRef: MatDialogRef<VideoUploadModalComponent>,
    private _videoUploadService: FileStorageService,
    @Inject(MAT_DIALOG_DATA) public data: { videoMessageForm: FormGroup }
  ) { }

  ngOnInit(): void {
    this.videoModalForm = this.data.videoMessageForm;
    this.videoPath = this.videoModalForm.controls['fileSrc'].value;
  }

  closeModal() {
    if (!this.videoPath) {
      this.videoModalForm.controls['fileName'].setValue('');
    }

    this.dialogRef.close();
  }

  openFileExplorer() {
    this.input?.nativeElement.click();
  }

  onVideoSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.videoPath = reader.result as string;
        this.videoName = this.selectedFile.name;
        this.videoModalForm.patchValue({ fileName: this.videoName });
      };
    }
  }

  async apply() {
    this.isUploading = true
    const name = this.videoModalForm.controls['fileName'].value;
    const videoName = name ? name : this.selectedFile.name;

    const res = await this._videoUploadService.uploadSingleFile(
      this.selectedFile,
      videoName
    );

    res.subscribe((url) => {
      this._autofillVideoUrl(url, videoName);
      this.isUploading = false;
      this.dialogRef.close();
    });
  }

  private _autofillVideoUrl(url: string, videoName: string) {
    this.videoModalForm.patchValue({ fileSrc: url, fileName: videoName });
    this.videoPath = url;
  }
}

