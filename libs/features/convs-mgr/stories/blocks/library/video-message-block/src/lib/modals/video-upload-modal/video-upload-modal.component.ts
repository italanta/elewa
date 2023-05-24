import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileStorageService } from '@app/state/file';

@Component({
  selector: 'app-video-upload-modal',
  templateUrl: './video-upload-modal.component.html',
  styleUrls: ['./video-upload-modal.component.scss'],
})
export class VideoUploadModalComponent implements OnInit{
  @ViewChild('videoInput') videoInput: ElementRef;
  videoModalForm: FormGroup;
  videoName: string;
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

  constructor(
    private dialogRef: MatDialogRef<VideoUploadModalComponent>,
    private _videoUploadService: FileStorageService,
    @Inject(MAT_DIALOG_DATA) public data:{videoMessageForm: FormGroup},
  ) {}

  ngOnInit(): void {
    this.videoModalForm = this.data.videoMessageForm;
    this.videoPath = this.videoModalForm.controls['fileSrc'].value
    // Set default value for mediaQuality
    this.videoModalForm.patchValue({ mediaQuality: this.defaultSize });
  }

  closeModal() {
    this.dialogRef.close();
  }
  

  submit(){
    console.log('submit was clicked')
    this.apply()
  }

  async apply() {
    const videoFile = this.videoInput.nativeElement.files[0] as File;
  
    if (videoFile) {
      const videoName = this.videoModalForm.controls['fileName'].value || videoFile.name;
      const res: any = await this._videoUploadService.uploadSingleFile(videoFile, videoName);
      res.subscribe((url: string) => {
        this._autofillVideoUrl(url, videoName);
        this.dialogRef.close();
      });
    } else {
      this.dialogRef.close();
    }
  }
  
  onVideoSelected(event: any) {
    const file = event.target.files[0] as File;
  
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const videoUrl = reader.result as string;
        this.videoPath = videoUrl;
        this.videoName = file.name;
        this.videoModalForm.patchValue({ fileName: this.videoName });
      };
    }
  }
   
  private _autofillVideoUrl(url: string, videoName: string) {
    this.videoModalForm.patchValue({fileSrc: url, fileName:videoName})
    this.videoPath = url
  }
}
