import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileStorageService } from '@app/state/file';
import { SubSink } from 'subsink';
import { VideoService } from '../../services/video-service';

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
  videoUrl: string;
  
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
    private fileStorageService: FileStorageService,
    private _videoService: VideoService
  ) {}

  ngOnInit(): void {
      this.createFormGroup()
      this.testingData = this.data
      console.log(this.testingData)
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
    const file = this.videoModalForm.controls['videoFile'].value;
    const size = this.videoModalForm.controls['size'].value;
  
    try {
      const result = await this.fileStorageService.uploadSingleFile(file, name);
      this.dialogRef.close(result);
    } catch (error) {
      console.error('Error uploading video', error);
    }
  }
  
  
  

  onVideoSelected(file: File) {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.videoFile = file;
        this.videoPath = reader.result as string;
        this.videoModalForm.patchValue({
          videoName: file.name,
          videoFile: file,
          size: '' // Set the default size value here
        });
      };
    }
  }
  
}
