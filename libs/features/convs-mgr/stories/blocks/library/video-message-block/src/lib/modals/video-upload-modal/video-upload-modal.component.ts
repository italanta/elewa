import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  videoUrl = '';
  videoInputId = 'videoInput';
  //videoInputUpload = 'videoInputUpload';
  testingData: any
  
  constructor(
    private dialogRef: MatDialogRef<VideoUploadModalComponent>,
    private _formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fileStorageService: FileStorageService
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

   apply(){
    console.log(this.videoModalForm.value)
    
  }
  
  async processVideo(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.videoUrl = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.videoFile = event.target.files[0];
  
      this.videoUrl = URL.createObjectURL(event.target.files[0]);
      this.data.videoMessageForm.patchValue({ fileName: this.videoFile.name });
    }

    //Step 1 - Create the file path that will be in firebase storage
    const vidFilePath = `videos/${this.videoFile.name}_${new Date().getTime()}`;

    const response = await this.fileStorageService.uploadSingleFile(this.videoFile, vidFilePath)
    this._sBs.sink = response.subscribe(url => this._autofillVideoUrl(url))
  }

  private _autofillVideoUrl(url: any) {
    this.data.videoMessageForm.patchValue({ fileSrc: url });
  }
}
