import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileStorageService } from '@app/state/file';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-video-upload-modal',
  templateUrl: './video-upload-modal.component.html',
  styleUrls: ['./video-upload-modal.component.scss'],
})
export class VideoUploadModalComponent implements OnInit {
  videoModalForm: FormGroup;
  videoPath: string;

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
  updateVideoTranslation: string;

  constructor(
    private dialogRef: MatDialogRef<VideoUploadModalComponent>,
    private _videoUploadService: FileStorageService,
    @Inject(MAT_DIALOG_DATA) public data: { videoMessageForm: FormGroup },
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.videoModalForm = this.data.videoMessageForm;
    this.videoPath = this.videoModalForm.controls['fileSrc'].value;

    this.translate.get('update video').subscribe((translation: string) => {
      this.updateVideoTranslation = translation;
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  apply() {
    this.dialogRef.close();
  }

  openFileExplorer() {
    document.getElementById(this.videoInputId)?.click();
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0] as File;

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const name = this.videoModalForm.controls['fileName'].value;
        const videoName = name ? name : file.name;

        const res = await this._videoUploadService.uploadSingleFile(file, videoName);
        res.subscribe((url) => this._autofillVideoUrl(url, videoName));
      };
    }
  }

  private _autofillVideoUrl(url: string, videoName: string) {
    this.videoModalForm.patchValue({ fileSrc: url, fileName: videoName });
    this.videoPath = url;
  }
}
