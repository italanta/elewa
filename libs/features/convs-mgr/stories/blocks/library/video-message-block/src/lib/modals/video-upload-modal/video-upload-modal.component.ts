import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileStorageService } from '@app/state/file';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-video-upload-modal',
  templateUrl: './video-upload-modal.component.html',
  styleUrls: ['./video-upload-modal.component.scss'],
})
export class VideoUploadModalComponent implements OnInit{
  private _sBs = new SubSink()
  videoModalForm: FormGroup;
  title = 'Upload Video';
  videoName: string;
  videoFile: File;
  videoPath: string
 
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
    @Inject(MAT_DIALOG_DATA) public data:{videoMessageForm: FormGroup},
  ) {}

  ngOnInit(): void {
    this.videoModalForm = this.data.videoMessageForm;
  }

  closeModal() {
    this.dialogRef.close();
  }

  apply() {
    this.dialogRef.close()
  }
  
  async onVideoSelected(event:any) {
    const file = event.target.files[0]
    // Getting a file from explorer, first position
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        // Get video name 
        const name = this.videoModalForm.controls['fileName'].value;
        const videoName = name ? name : file.name

        // upload videofile and patch values
        const res = await this._videoUploadService.uploadSingleFile(file, videoName);
        res.subscribe((url) => this._autofillVideoUrl(url, videoName))
      };
    }
 } 

  private _autofillVideoUrl(url: string, videoName: string) {
    this.videoModalForm.patchValue({fileSrc: url, fileName:videoName})
    this.videoPath = url
  }
}
