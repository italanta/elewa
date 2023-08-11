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
  byPassedLimits: any[] = [];

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

    const fileSize = this.videoModalForm.get('fileSize')?.value;

    if (fileSize) {
      this._checkSizeLimit(fileSize);
    };
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

    // Check if file bypasses size limit.
    const fileSizeInKB = this.selectedFile.size / 1024;
    this._checkSizeLimit(fileSizeInKB);

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

    const fileSizeInKB = this.selectedFile.size / 1024;
    const res = await this._videoUploadService.uploadSingleFile(this.selectedFile, `videos/${videoName}`);

    res.subscribe((url) => {
      this._autofillVideoUrl(url, videoName, fileSizeInKB);
      this.dialogRef.close();
    });
  }
  
  /** Step 3 Check if file bypasses size limit. */
  private _checkSizeLimit(size:number) {
    this.byPassedLimits = this._videoUploadService.checkFileSizeLimits(size, 'video');
  };
  
  private _autofillVideoUrl(url: string, videoName: string, fileSize: number) {
    this.isUploading = false;
    this.videoModalForm.patchValue({ fileSrc: url, fileName: videoName, fileSize });
    this.videoPath = url;
  }
}

