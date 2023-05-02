import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileStorageService } from '@app/state/file';
import { SubSink } from 'subsink';

import { Story } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'app-video-upload-modal',
  templateUrl: './video-upload-modal.component.html',
  styleUrls: ['./video-upload-modal.component.scss'],
})
export class VideoUploadModalComponent {
  title = 'Upload Video';
  videoName: string;
  videoFile: File;
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
  videoUrl = '';
  videoInputId = 'videoInput';
  videoInputUpload = 'videoInputUpload';
  private _sBs = new SubSink();

  constructor(
    private dialogRef: MatDialogRef<VideoUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { videoMessageForm: FormGroup; block: Story },
    private _videoUploadService: FileStorageService,
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  async apply(): Promise<void> {
    //Step 1 - Create the file path that will be in firebase storage
    const vidFilePath = `videos/${this.videoFile.name}_${new Date().getTime()}`;

    const response = await this._videoUploadService.uploadSingleFile(this.videoFile, vidFilePath);

    this._sBs.sink = response.subscribe((url) => {
      this.data.videoMessageForm.patchValue({ fileSrc: url });
      this.data.videoMessageForm.patchValue({ fileName: this.videoFile.name });
      this.dialogRef.close({
        name: this.videoFile.name,
        file: this.videoFile,
        url,
      });
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.videoUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.videoFile = file;
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
