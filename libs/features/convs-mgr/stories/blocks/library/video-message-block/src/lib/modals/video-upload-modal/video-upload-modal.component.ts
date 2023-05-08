import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileStorageService } from '@app/state/file';
import { SubSink } from 'subsink';

import { VideoService } from '../../services/video-service';
import { firstValueFrom } from 'rxjs';
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
  //videoUrl: string;
  @Output() videoUrl = new EventEmitter<any>();

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
  testingData: any

  constructor(
    private dialogRef: MatDialogRef<VideoUploadModalComponent>,
    private _formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _videoUploadService: FileStorageService,
    private _videoService: VideoService
  ) {}

  ngOnInit(): void {
      this.createFormGroup()
      this.testingData = this.data
      console.log(this.testingData)
      console.log('VideoUploadModalComponent initialized');
  }

  createFormGroup(){
    this.videoModalForm = this._formbuilder.group({
      videoName: [''],
      videoFile: [''],
      size: ['']
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  async apply() {
    const name = this.videoModalForm.controls['videoName'].value;
    const size = this.videoModalForm.controls['size'].value;
    // Get the video URL from the onVideoSelected emitter
    const url = await firstValueFrom(this.videoUrl);
    console.log('url', url);
    // Create a new object with the video details
    const video = {
      name,
      url,
      size
    };
    console.log('video', video);
    this.dialogRef.close(video);
  }
  
  async onVideoSelected(file: File) {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const videoName = this.videoModalForm.controls['videoName'].value;
        const url = await this._videoUploadService.uploadSingleFile(file, videoName);
        
        this.videoUrl.emit(url);
  
        this.videoFile = file;
        this.videoPath = reader.result as string;
        this.videoModalForm.patchValue({
          videoFile: file,
        });
      };
    }
  } 
}
